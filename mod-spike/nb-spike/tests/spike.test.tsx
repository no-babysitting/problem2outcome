import type { On } from 'claude-code'
import { expect, test } from 'claude-code/testing'

import { strip } from '../hooks/probe-strip.js'

const ASSISTANT = {
  plugin: 'nb-spike',
  component: 'AssistantMessage',
  surface: 'desktop',
  requestId: 'msg-1',
  props: { text: '', isFirstOfReply: true },
} as const

// Giờ cố định: mod ghi nhật ký có giờ.
const clock = (on: On): void => {
  on('clock.now', () => ({ value: 1_000_000 }))
  on('ui.log', () => ({ value: undefined }))
}

// Đứng thay cho engine: hộp hỏi $.ui.ask đi qua tool.call của AskUserQuestion; mọi tool khác chạy bình thường.
const engine = (on: On, answer: string, counts: { asked: number; ran: number }): void => {
  on('tool.call', (_, e) => {
    if (e.tool === 'AskUserQuestion') {
      counts.asked += 1

      return { result: { questions: [], answers: { [(e as { questions: { question: string }[] }).questions[0]?.question ?? '']: answer } } }
    }
    counts.ran += 1

    return { result: {} }
  })
}

// Nhớ lại thứ mod đã lưu, đứng thay cho máy.
const store = (on: On, entries: Record<string, unknown> = {}): Map<string, unknown> => {
  const kept = new Map(Object.entries(entries))

  on('store.get', (_, e) => ({ value: kept.get(e.key) }))
  on('store.set', (_, e) => {
    kept.set(e.key, e.value)

    return { value: undefined }
  })

  return kept
}

test('strip: cắt dòng <nb> hoàn chỉnh và lấy nội dung', () => {
  const r = strip('Done.\n<nb>You chose the criteria well.</nb>')

  expect(r.text).toBe('Done.')
  expect(r.nb).toBe('You chose the criteria well.')
  expect(r.hadPartial).toBe(false)
})

test('strip: thẻ đang stream dở không lộ ra', () => {
  for (const tail of ['\n<', '\n<n', '\n<nb', '\n<nb>', '\n<nb>You cho']) {
    const r = strip(`Working on it.${tail}`)

    expect(r.text).toBe('Working on it.')
    expect(r.nb).toBe(null)
    expect(r.hadPartial).toBe(true)
  }
})

test('strip: câu bình thường có dấu < giữa dòng thì để nguyên', () => {
  const text = 'Use a < b and the <nb-tool> name is fine.'

  expect(strip(text).text).toBe(text)
})

test('prompt.submit: gắn khối ngữ cảnh ẩn, không đổi chữ người dùng', async ($, on) => {
  let seen: readonly string[] | undefined
  let text = ''

  store(on)
  on('prompt.submit', (_, e) => {
    seen = e.context
    text = e.text

    return { text: e.text, context: e.context }
  })

  await $.prompt.submit({ text: 'Help me plan the launch' } as never)

  expect(text).toBe('Help me plan the launch')
  expect(seen?.some(block => block.includes('<nb>'))).toBe(true)
})

test('AssistantMessage: hình vẽ không còn dòng <nb>', async ($, on) => {
  store(on)
  clock(on)
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text>{(e.props as { text: string }).text}</Text>
  })

  const ui = await $.ui.mount({
    ...ASSISTANT,
    props: { ...ASSISTANT.props, text: 'All set.\n<nb>Criteria met.</nb>' },
  })

  expect((await ui.find({ type: 'Text', text: /All set/ }))?.text).toBe('All set.')
  expect(await ui.find({ type: 'Text', text: /nb/ })).toBeUndefined()
  await ui.unmount()
})

test('tool.call: chỉ hỏi "thế nào là xong" một lần, và không tự duyệt', async ($, on) => {
  const counts = { asked: 0, ran: 0 }

  store(on)
  clock(on)
  engine(on, 'Đã có tiêu chí, cứ làm', counts)

  await $.tool.call({ tool: 'Write', file_path: '/tmp/a.md', content: 'x' })
  await $.tool.call({ tool: 'Write', file_path: '/tmp/b.md', content: 'y' })
  await $.tool.call({ tool: 'Read', file_path: '/tmp/a.md' })

  expect(counts.asked).toBe(1)
  expect(counts.ran).toBe(3)
})

test('tool.call: chọn "Chưa" thì từ chối và Claude được dặn hỏi lại người dùng', async ($, on) => {
  const counts = { asked: 0, ran: 0 }

  store(on)
  clock(on)
  engine(on, 'Chưa, để tôi nói', counts)

  const result = await $.tool.call({ tool: 'Write', file_path: '/tmp/a.md', content: 'x' })

  expect(counts.ran).toBe(0)
  expect('deny' in result && typeof result.deny === 'string').toBe(true)
})

test('/spike-lang: dịch một lần, lưu vào kho; lần sau lấy từ kho, không gọi model', async ($, on) => {
  let calls = 0
  const kept = store(on)

  clock(on)
  const translated = { ready: 'a', working: 'b', done: 'c', long: 'd', accepted: 'e' }

  on('model.complete', () => {
    calls += 1

    return { value: { isAnswered: true, text: JSON.stringify(translated), usage: { input_tokens: 80, output_tokens: 60 } } as never }
  })

  const first = await $.command.run({ command: 'spike-lang', args: 'vi' } as never)
  const second = await $.command.run({ command: 'spike-lang', args: 'vi' } as never)

  expect(calls).toBe(1)
  expect(kept.get('nb-spike.lines.vi')).toEqual(translated)
  expect(first.text).toMatch(/dịch/)
  expect(second.text).toMatch(/kho/)
})

test('turn.complete: dòng <nb> của câu trả lời cuối sang mascot', async ($, on) => {
  const written: unknown[] = []

  store(on)
  clock(on)
  on('state.get', () => ({ value: { value: undefined, version: 0 } }))
  on('state.set', (_, e) => {
    written.push(e)

    return { value: { version: 1 } } as never
  })
  on('turn.complete', (_, e) => ({ text: e.answer }))

  await $.turn.complete({
    answer: 'Done.\n<nb>You set clear criteria.</nb>',
    durationMs: 10,
    isAborted: false,
    turnId: 't1',
    reason: 'answer',
  })

  expect(JSON.stringify(written)).toContain('You set clear criteria.')
})

test('lệnh của mod khác đi thẳng xuống, nb-spike không chạm vào', async ($, on) => {
  let seen = ''

  store(on)
  clock(on)
  on('command.run', (_, e) => {
    seen = e.command

    return { text: 'matrix ok' }
  })

  const result = await $.command.run({ command: 'matrix', args: '' } as never)

  expect(seen).toBe('matrix')
  expect(result.text).toBe('matrix ok')
})

test('/teach-me có chủ đề thì điền cả chủ đề; không có thì chừa chỗ sau "Topic:"', async ($, on) => {
  const filled: string[] = []

  store(on)
  clock(on)
  on('prompt.fill', (_, e) => {
    filled.push(e.text)

    return { isFilled: true } as never
  })

  await $.command.run({ command: 'teach-me', args: 'prompt caching' } as never)
  await $.command.run({ command: 'teach-me', args: '' } as never)

  expect(filled[0]?.endsWith('Topic: prompt caching')).toBe(true)
  expect(filled[1]?.endsWith('Topic: ')).toBe(true)
})

test('/mascot lưu mức vào kho để phiên sau dùng lại', async ($, on) => {
  const kept = store(on)

  clock(on)
  await $.command.run({ command: 'mascot', args: 'quiet' } as never)

  expect(kept.get('nb-spike.level')).toBe('quiet')
})
