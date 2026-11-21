// Run with `claude plugin test mod/nb` from the repository root. A plain `bun test` has no `claude-code/testing` module.
import type { On } from 'claude-code'
import { expect, test } from 'claude-code/testing'

import { bandSVG, wrap } from '../hooks/band-svg.js'
import { presetLine, strip, WELCOME_BOTH } from '../hooks/colleague.js'
import { languageOf, languageOfText, parseDecisions, progressOf, shellWriteTarget, supportLevels } from '../hooks/decisions.js'
import { asciiSceneSVG } from '../hooks/scene.js'

// ---------- fixtures ----------

const TEMPLATE = `# Task: <short name>

Date: YYYY-MM-DD · Size: small | larger

## 1. Real problem
<!-- Larger tasks only. -->
Confirmed: no

## 2. Done means
<!-- Checkable criteria. -->
Confirmed: no
- [ ]

## 3. Delegate / keep
<!-- Larger tasks only. -->
Confirmed: no

## 4. Result
<!-- One line per criterion. -->
- Decision: accepted on first try | redo (why)
- Lesson for next time:
`

const LARGER_TWO_MADE = TEMPLATE.replace('<short name>', 'Launch newsletter')
  .replace('small | larger', 'larger')
  .replace('<!-- Larger tasks only. -->\nConfirmed: no\n', '<!-- Larger tasks only. -->\nConfirmed: yes\nReaders churn because issues are irregular.\n')
  .replace('Confirmed: no\n- [ ]\n', 'Confirmed: yes\n- [ ] One issue drafted for 12 Dec\n- [ ] Under 400 words\n')

const SMALL_ACCEPTED = TEMPLATE.replace('<short name>', 'Fix invoice table')
  .replace('small | larger', 'small')
  .replace('Confirmed: no\n- [ ]\n', 'Confirmed: yes\n- [x] Totals match the sheet\n')
  .replace('accepted on first try | redo (why)', 'accepted on first try')

type Files = Record<string, { text: string; mtimeMs: number }>

/** Stands for the user's workspace on disk. */
const workspace = (on: On, files: Files): void => {
  // The engine hands paths on resolved against the test's working directory: compare them from the workspace root.
  const rel = (path: string): string => path.replace(/^(?:.*?\/)?(?=(?:tasks|me\.md|AGENTS\.md)(?:\/|$))/, '').replace(/\/+$/, '')
  const dirs = (path: string): { name: string; kind: 'dir' }[] =>
    [...new Set(Object.keys(files).filter(p => p.startsWith(`${path}/`)).map(p => p.slice(path.length + 1).split('/')[0] ?? ''))].map(name => ({ name, kind: 'dir' }))

  on('fs.exists', (_, e) => ({ value: rel(e.path) in files }))
  on('fs.read', (_, e) => {
    const f = files[rel(e.path)]

    if (f === undefined) {
      throw new Error('ENOENT')
    }

    return { value: f.text }
  })
  on('fs.stat', (_, e) => {
    const f = files[rel(e.path)]

    if (f === undefined) {
      throw new Error('ENOENT')
    }

    return { value: { kind: 'file', size: f.text.length, mtimeMs: f.mtimeMs, isLink: false } as never }
  })
  on('fs.list', (_, e) => ({ value: dirs(rel(e.path)).map(d => ({ ...d, size: 0, mtimeMs: 0, isLink: false })) as never }))
}

/** Stands for the engine around the mod: store, theme, clock, usage, commands. */
const engine = (on: On, store: Map<string, unknown> = new Map()): Map<string, unknown> => {
  on('store.get', (_, e) => ({ value: store.get(e.key) }))
  on('store.set', (_, e) => {
    store.set(e.key, e.value)

    return { value: undefined }
  })
  on('theme.set', () => ({ value: { isDrawn: true } as never }))
  on('session.usage', () => ({ value: { context: { percent: 42 }, rateLimits: [{ kind: 'five_hour', percentUsed: 37 }] } as never }))
  on('command.register', (_, e) => ({ value: { command: e.name } as never }))
  on('clock.after', () => ({ value: undefined }))
  on('ui.log', () => ({ value: undefined }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  return store
}

const BAND = {
  plugin: 'nb',
  component: 'AbovePrompt',
  props: { hasSurvey: false, isCollapsed: false, isWorking: false, maxRows: 10, bodyColumns: 100, scroll: { offset: 0, bodyRows: 9 }, view: {} },
} as const

// ---------- decisions.md ----------

test('decisions: the empty template has no decision made', () => {
  const d = parseDecisions(TEMPLATE, '2026-11-20-launch-newsletter')

  expect(d.made).toEqual([false, false, false, false])
  expect(d.size).toBe('unknown')
  expect(d.next).toBe(1)
  expect(d.name).toBe('launch newsletter')
})

test('decisions: a larger task with the problem and criteria written', () => {
  const d = parseDecisions(LARGER_TWO_MADE)

  expect(d.name).toBe('Launch newsletter')
  expect(d.made).toEqual([true, true, false, false])
  expect(d.next).toBe(3)
  expect(progressOf(d)).toBe(0.5)
})

test('decisions: an unknown Confirmed value counts as not made (n/a, typos)', () => {
  for (const v of ['n/a', 'N/A', 'maybe', 'yess', '']) {
    const d = parseDecisions(LARGER_TWO_MADE.replace(/Confirmed: yes[^\n]*/, `Confirmed: ${v}`))

    expect(d.made[0]).toBe(false)
    expect(d.skipped[0]).toBe(false)
  }
})

test('decisions: once a larger task is accepted, the band points at no earlier decision (review F3-02)', () => {
  const d = parseDecisions(LARGER_TWO_MADE.replace(/- Decision:[^\n]*/, '- Decision: accepted on first try · by: user'))

  expect(d.made[0]).toBe(true)
  expect(d.made[2]).toBe(false)
  expect(d.accepted).toBe(true)
  expect(d.next).toBe(null)
})

test('decisions: a small task only has decisions 2 and 4; accepted is all done', () => {
  const d = parseDecisions(SMALL_ACCEPTED)

  expect(d.applies).toEqual([false, true, false, true])
  expect(d.accepted).toBe(true)
  expect(d.next).toBe(null)
  expect(progressOf(d)).toBe(1)
})

test('decisions: words in a section are not a decision; only Confirmed: yes is (review F-L3-01)', () => {
  const larger = TEMPLATE.replace('small | larger', 'larger')

  for (const filler of ['- [ ] (chưa đặt)', '- [ ] (chờ bạn)', '- [ ] Under 150 words (draft, not confirmed yet)']) {
    const d = parseDecisions(larger.replace('Confirmed: no\n- [ ]\n', `Confirmed: no\n${filler}\n`))

    expect(d.made[1]).toBe(false)
    expect(d.next).toBe(1)
  }
  expect(parseDecisions(larger.replace(/Confirmed: no\n- \[ \]\n/, 'Confirmed: yes\n- [ ] Under 150 words\n')).made[1]).toBe(true)

  const skipped = parseDecisions(larger.replace('Confirmed: no\n- [ ]\n', 'Confirmed: skipped\n- [ ]\n').replace(/## 1\. Real problem\n<!-- Larger tasks only. -->\nConfirmed: no/, '## 1. Real problem\n<!-- Larger tasks only. -->\nConfirmed: yes'))

  expect(skipped.made[1]).toBe(false)
  expect(skipped.skipped[1]).toBe(true)
  expect(skipped.next).toBe(3)
})

test('shell writes are seen; reads and /dev/null are not', () => {
  expect(shellWriteTarget("cat > tasks/x/post.md <<'EOF'")).toBe('tasks/x/post.md')
  expect(shellWriteTarget('echo hi | tee -a notes.txt')).toBe('notes.txt')
  expect(shellWriteTarget('ls tasks 2>/dev/null')).toBe(null)
  expect(shellWriteTarget('grep -c x a.md 2>&1')).toBe(null)
  expect(shellWriteTarget('wc -w post.md')).toBe(null)
  // review F2-03: a ">" inside quotes or an arrow is not a redirect
  expect(shellWriteTarget('node -e "const f = x => x+1"')).toBe(null)
  expect(shellWriteTarget('git log --format="%h > %s"')).toBe(null)
  expect(shellWriteTarget("awk '$1 > 3' data.csv")).toBe(null)
  expect(shellWriteTarget('echo "a > b" > "out file.md"')).toBe('out file.md')
  expect(shellWriteTarget('printf x >> log.txt')).toBe('log.txt')
})

test('me.md: the language line', () => {
  expect(languageOf('Language: Tiếng Việt\n')).toBe('vi')
  expect(languageOf('Language: English')).toBe('en')
  expect(languageOf('Language: \n')).toBe(null)
})

// ---------- <nb> line ----------

test('strip: a complete <nb> line leaves the reply and goes to the bubble', () => {
  const r = strip('Done.\n<nb>Criteria 1 and 2 met; 3 not yet.</nb>')

  expect(r.text).toBe('Done.')
  expect(r.nb).toBe('Criteria 1 and 2 met; 3 not yet.')
})

test('strip: a half-streamed tag never shows', () => {
  for (const tail of ['\n<', '\n<n', '\n<nb', '\n<nb>', '\n<nb>Crit']) {
    expect(strip(`Working.${tail}`).text).toBe('Working.')
  }
})

test('strip: ordinary text is left byte for byte', () => {
  const text = 'Use a < b and the <nb-tool> name is fine.\n\n'

  expect(strip(text).text).toBe(text)
})

// ---------- drawings ----------

test('band: every state draws, under the Svg limit, with the face in it', () => {
  for (const state of ['idle', 'thinking', 'working', 'asking', 'overloaded', 'verified'] as const) {
    const svg = bandSVG({
      state,
      line: 'Your call: what counts as done? A few checkable lines, please, so I know when to stop.',
      isStale: false,
      decisions: parseDecisions(LARGER_TWO_MADE),
      contextPercent: 42,
      limit: { kind: 'five_hour', percentUsed: 37 },
      lang: 'vi',
    })

    expect(svg.length < 131072).toBe(true)
    expect(svg.includes('[')).toBe(true)
    expect(svg.includes('<script')).toBe(false)
    // DS motion rule: nothing loops forever.
    expect(svg.includes('infinite')).toBe(false)
  }
})

test('scene: each sun height is a valid, small enough SVG', () => {
  for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
    const svg = asciiSceneSVG({ progress })

    expect(svg.startsWith('<svg')).toBe(true)
    expect(svg.length < 131072).toBe(true)
    expect(/<image|<script|href/.test(svg)).toBe(false)
    expect(svg.includes('infinite')).toBe(false)
  }
})

test('preset lines name the user next decision, never praise', () => {
  expect(presetLine('vi', parseDecisions(LARGER_TWO_MADE), false)).toMatch(/giao/)
  expect(presetLine('en', null, true)).toMatch(/You decide/)
})

// ---------- hooks ----------

test('band on desktop draws an Svg; on the terminal, the face as text', async ($, on) => {
  engine(on)
  workspace(on, { 'AGENTS.md': { text: '#', mtimeMs: 1 }, 'tasks/2026-11-20-launch/decisions.md': { text: LARGER_TWO_MADE, mtimeMs: 5 } })
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true } as never)

  const desk = await $.ui.mount({ ...BAND, surface: 'desktop' } as never)

  const drawn = (await desk.drawn()) as { type: string; props: { source: string } }

  expect(drawn.type).toBe('Svg')
  expect(drawn.props.source.includes('giao việc') || drawn.props.source.includes('delegate')).toBe(true)
  await desk.unmount()

  const term = await $.ui.mount({ ...BAND, surface: 'terminal' } as never)

  expect((await term.find({ type: 'Text', text: /\[•_•\]/ }))?.text).toBe('[•_•]')
  expect(await term.find({ type: 'Text', text: /giao việc|delegate/ })).toBeDefined()
  await term.unmount()
})

test('a tool call shows working; the end of the turn puts the <nb> line in the bubble', async ($, on) => {
  engine(on)
  workspace(on, { 'me.md': { text: 'Language: vi', mtimeMs: 1 }, 'tasks/2026-11-20-launch/decisions.md': { text: LARGER_TWO_MADE, mtimeMs: 5 } })
  let seen = ''

  on('tool.call', () => ({ result: {} }))
  on('turn.complete', (_, e) => {
    seen = e.answer

    return { text: e.answer } as never
  })
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true } as never)

  await $.tool.call({ tool: 'Read', file_path: 'a.md' } as never)
  await $.turn.complete({ answer: 'Xong.\n<nb>Tiêu chí 1 đạt, tiêu chí 2 chưa.</nb>', durationMs: 5, isAborted: false, turnId: 't1', reason: 'answer' } as never)

  expect(seen.includes('<nb>')).toBe(true)
  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' } as never)

  expect((await ui.find({ type: 'Text', text: /Tiêu chí 1 đạt/ }))?.text).toBe('Tiêu chí 1 đạt, tiêu chí 2 chưa.')
  await ui.unmount()
})

test('prompt.submit adds the hidden <nb> request and keeps the user text', async ($, on) => {
  engine(on)
  workspace(on, {})
  let context: readonly string[] | undefined
  let text = ''

  on('prompt.submit', (_, e) => {
    context = e.context
    text = e.text

    return { text: e.text, context: e.context } as never
  })
  await $.prompt.submit({ text: 'Help me plan the launch' } as never)

  expect(text).toBe('Help me plan the launch')
  expect(context?.some(c => c.includes('<nb>'))).toBe(true)
})

test('first run: a Vietnamese first prompt makes the band speak Vietnamese; later prompts do not flip it', async ($, on) => {
  engine(on)
  workspace(on, {})
  const contexts: (readonly string[] | undefined)[] = []

  on('prompt.submit', (_, e) => {
    contexts.push(e.context)

    return { text: e.text, context: e.context } as never
  })
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true } as never)
  await $.prompt.submit({ text: 'Viết giúp mình email mời khách cũ chụp ảnh Tết' } as never)
  await $.prompt.submit({ text: 'ok, plain English now' } as never)

  expect(contexts[0]?.some(c => c.includes('Vietnamese'))).toBe(true)
  expect(contexts[1]?.some(c => c.includes('Vietnamese'))).toBe(true)
})

test('first run before any prompt: the welcome speaks both languages and fits the bubble', async ($, on) => {
  engine(on)
  workspace(on, {})
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true } as never)

  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' } as never)

  expect((await ui.find({ type: 'Text', text: /Bạn quyết/ }))?.text).toBe(WELCOME_BOTH)
  await ui.unmount()
  expect(wrap(WELCOME_BOTH, 380).join(' ')).toBe(WELCOME_BOTH)
})

test('languageOfText: Vietnamese letters, not a single accent', () => {
  expect(languageOfText('Viết giúp mình email')).toBe('vi')
  expect(languageOfText('Write an email to past clients')).toBe(null)
  expect(languageOfText('Café menu for the launch')).toBe(null)
  expect(languageOfText('Send the contract to Nguyễn Văn An')).toBe(null)
  expect(languageOfText('chụp ảnh gia đình')).toBe('vi')
})

test('languageOfText: Vietnamese names in English text, Romanian and Croatian stay English; Vietnamese without marks is found (review F5-01, O5-03)', () => {
  for (const en of [
    'Write an email to Nguyễn Văn Đức about the invoice',
    'Book a shoot for Trần Thị Mỹ Linh next week',
    'Invite Lê Quốc Việt and Phạm Thị Hương to the review',
    'Send the quote to Đặng Hoàng Anh',
    'Mulțumesc pentru răspunsul tău, vă trimit mâine documentele',
    'Pošalji email Đorđe Petroviću i Ani',
    'hi',
    'ok',
    'Write the brief for Viet and Anh',
  ]) {
    expect([en, languageOfText(en)]).toEqual([en, null])
  }
  for (const vi of ['viet email cho khach cu', 'giup minh lam bao gia nhe', 'Mình cần một kế hoạch ra mắt', 'Lan ơi, viết giúp mình thư cảm ơn khách nhé']) {
    expect([vi, languageOfText(vi)]).toEqual([vi, 'vi'])
  }
})

test('first run: "hi" first decides nothing; a later clearly Vietnamese message switches the band (review O5-03)', async ($, on) => {
  engine(on)
  workspace(on, {})
  const contexts: (readonly string[] | undefined)[] = []

  on('prompt.submit', (_, e) => {
    contexts.push(e.context)

    return { text: e.text, context: e.context } as never
  })
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true } as never)
  await $.prompt.submit({ text: 'hi' } as never)
  await $.prompt.submit({ text: 'viet email cho khach cu moi chup anh Tet' } as never)

  expect(contexts[0]?.some(c => c.includes('Vietnamese'))).toBe(false)
  expect(contexts[1]?.some(c => c.includes('Vietnamese'))).toBe(true)
})

test('supportLevels reads rows written in bold or code (review O5-04)', () => {
  expect(supportLevels('| **1. Real problem** | **Challenge** | |\n| `2. Done means` | _Record_ | |')).toEqual(['challenge', 'record', null, null])
})

test('before the first write with no criteria, ask once; "not yet" stops the write', async ($, on) => {
  engine(on)
  workspace(on, { 'AGENTS.md': { text: '#', mtimeMs: 1 }, 'tasks/2026-11-20-x/decisions.md': { text: TEMPLATE, mtimeMs: 2 } })
  let asked = 0
  let ran = 0

  on('tool.call', (_, e) => {
    if (e.tool === 'AskUserQuestion') {
      asked += 1
      const q = (e as { questions: { question: string }[] }).questions[0]?.question ?? ''

      return { result: { questions: [], answers: { [q]: 'Not yet, ask me first' } } } as never
    }
    ran += 1

    return { result: {} }
  })
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true } as never)

  const first = await $.tool.call({ tool: 'Write', file_path: 'tasks/2026-11-20-x/plan.md', content: 'x' } as never)
  await $.tool.call({ tool: 'Write', file_path: 'tasks/2026-11-20-x/plan.md', content: 'x' } as never)

  expect(asked).toBe(1)
  expect('deny' in first || (first as { isError?: boolean }).isError === true).toBe(true)
  expect(ran).toBe(1)
})

test('writing decisions.md itself is never held', async ($, on) => {
  engine(on)
  workspace(on, { 'AGENTS.md': { text: '#', mtimeMs: 1 } })
  let asked = 0

  on('tool.call', (_, e) => {
    if (e.tool === 'AskUserQuestion') {
      asked += 1
    }

    return { result: {} }
  })
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true } as never)
  await $.tool.call({ tool: 'Write', file_path: 'tasks/2026-11-20-x/decisions.md', content: 'x' } as never)

  expect(asked).toBe(0)
})

test('/mascot quiet is kept for the next session; other mods commands pass untouched', async ($, on) => {
  const store = engine(on)

  workspace(on, {})
  let other = ''
  let context: readonly string[] | undefined

  on('prompt.submit', (_, e) => {
    context = e.context

    return { text: e.text, context: e.context } as never
  })
  on('command.run', (_, e) => {
    other = e.command

    return { text: 'theirs' }
  })
  await $.command.run({ command: 'mascot', args: 'quiet' } as never)
  const result = await $.command.run({ command: 'matrix', args: '' } as never)

  expect(store.get('nb.level')).toBe('quiet')
  expect(other).toBe('matrix')
  expect(result.text).toBe('theirs')

})

test('a draft in "done means" that the user has not confirmed still gets the one question (review F-L3-01)', async ($, on) => {
  const draft = TEMPLATE.replace('small | larger', 'small').replace('Confirmed: no\n- [ ]\n', 'Confirmed: no\n- [ ] (chưa đặt)\n')

  engine(on)
  workspace(on, { 'AGENTS.md': { text: '#', mtimeMs: 1 }, 'tasks/2026-11-20-x/decisions.md': { text: draft, mtimeMs: 2 } })
  let asked = 0

  on('tool.call', (_, e) => {
    if (e.tool === 'AskUserQuestion') {
      asked += 1
      const q = (e as { questions: { question: string }[] }).questions[0]?.question ?? ''

      return { result: { questions: [], answers: { [q]: 'Criteria are clear, go on' } } } as never
    }

    return { result: {} }
  })
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true } as never)
  await $.tool.call({ tool: 'Bash', command: "cat > tasks/2026-11-20-x/post.md <<'EOF'\nhi\nEOF" } as never)

  expect(asked).toBe(1)
})

test('/nb tells where the task stands without a model call', async ($, on) => {
  engine(on)
  workspace(on, { 'tasks/2026-11-20-launch/decisions.md': { text: LARGER_TWO_MADE, mtimeMs: 5 } })
  const r = await $.command.run({ command: 'nb', args: '' } as never)

  expect(r.text).toMatch(/Launch newsletter/)
  expect(r.text).toMatch(/your turn/)
})


const ME_LEVELS = `# Me

Language: en

| Decision | Level | Since | Why |
|---|---|---|---|
| 1. Real problem | Guide | | first run |
| 2. Done means | Challenge | 2026-11-20 | wrote own criteria three times |
| 3. Delegate / keep | Guide | | first run |
| 4. Accept or redo | Record | | |
`

test('supportLevels reads the me.md table, English or Vietnamese names, and ignores other rows', () => {
  expect(supportLevels(ME_LEVELS)).toEqual(['guide', 'challenge', 'guide', 'record'])
  expect(supportLevels('| 2. Xong là gì | Thử thách | |')).toEqual([null, 'challenge', null, null])
  expect(supportLevels('Levels: Guide · Challenge · Record')).toEqual([null, null, null, null])
  expect(supportLevels('| 1. Real problem | Expert | |')).toEqual([null, null, null, null])
})

test('/nb shows the help level per decision from me.md, and says where it will live before me.md exists', async ($, on) => {
  engine(on)
  workspace(on, { 'me.md': { text: ME_LEVELS, mtimeMs: 1 } })
  const withMe = await $.command.run({ command: 'nb', args: '' } as never)

  expect(withMe.text).toMatch(/Help level \(me\.md\): real problem: Guide · done means: Challenge · delegate: Guide · accept: Record/)
})

test('/nb before me.md exists explains when the levels appear', async ($, on) => {
  engine(on)
  workspace(on, {})
  const r = await $.command.run({ command: 'nb', args: '' } as never)

  expect(r.text).toMatch(/made after you accept your first task/)
})

test('/nb marks a redo on decision 4 instead of a plain check', async ($, on) => {
  engine(on)
  const redone = LARGER_TWO_MADE.replace('accepted on first try | redo (why)', 'redo (too long)')

  workspace(on, { 'tasks/2026-11-20-launch/decisions.md': { text: redone, mtimeMs: 5 } })
  const r = await $.command.run({ command: 'nb', args: '' } as never)

  expect(r.text).toMatch(/4\. accept: ↺ redo/)
})
