import type { On } from 'claude-code'
import { expect, test } from 'claude-code/testing'

import { bandSVG } from '../hooks/band-svg.js'
import { presetLine, strip } from '../hooks/colleague.js'
import { languageOf, parseDecisions, progressOf } from '../hooks/decisions.js'
import { asciiSceneSVG } from '../hooks/scene.js'

// ---------- fixtures ----------

const TEMPLATE = `# Task: <short name>

Date: YYYY-MM-DD · Size: small | larger

## 1. Real problem
<!-- Larger tasks only. -->

## 2. Done means
<!-- Checkable criteria. -->
- [ ]

## 3. Delegate / keep
<!-- Larger tasks only. -->

## 4. Result
<!-- One line per criterion. -->
- Decision: accepted on first try | redo (why)
- Lesson for next time:
`

const LARGER_TWO_MADE = TEMPLATE.replace('<short name>', 'Launch newsletter')
  .replace('small | larger', 'larger')
  .replace('<!-- Larger tasks only. -->\n', '<!-- Larger tasks only. -->\nReaders churn because issues are irregular.\n')
  .replace('- [ ]\n', '- [ ] One issue drafted for 12 Dec\n- [ ] Under 400 words\n')

const SMALL_ACCEPTED = TEMPLATE.replace('<short name>', 'Fix invoice table')
  .replace('small | larger', 'small')
  .replace('- [ ]\n', '- [x] Totals match the sheet\n')
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

test('decisions: a small task only has decisions 2 and 4; accepted is all done', () => {
  const d = parseDecisions(SMALL_ACCEPTED)

  expect(d.applies).toEqual([false, true, false, true])
  expect(d.accepted).toBe(true)
  expect(d.next).toBe(null)
  expect(progressOf(d)).toBe(1)
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
  }
})

test('scene: each sun height is a valid, small enough SVG', () => {
  for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
    const svg = asciiSceneSVG({ progress })

    expect(svg.startsWith('<svg')).toBe(true)
    expect(svg.length < 131072).toBe(true)
    expect(/<image|<script|href/.test(svg)).toBe(false)
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

test('/nb tells where the task stands without a model call', async ($, on) => {
  engine(on)
  workspace(on, { 'tasks/2026-11-20-launch/decisions.md': { text: LARGER_TWO_MADE, mtimeMs: 5 } })
  const r = await $.command.run({ command: 'nb', args: '' } as never)

  expect(r.text).toMatch(/Launch newsletter/)
  expect(r.text).toMatch(/your turn/)
})

