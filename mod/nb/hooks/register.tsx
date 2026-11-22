// NB: the optional Claude Desktop mod for the problem2outcome workspace.
//
// What it adds (each piece traces to the PDD):
//   - The Colleague above the prompt: its face follows what really happens (prompt, tools, a question, the end
//     of a turn), and a speech bubble carries at most one sentence per turn (M3, C9).
//   - The task's four decisions under it, read from the newest tasks/*/decisions.md (zero tokens).
//   - A calm context and rate-limit meter, no red zones (C15).
//   - A coloured ASCII scene behind the chat; its sun rises as the user makes their decisions (C11).
//   - One question before the first file is written, only when the task has no criteria yet (M4, C8).
//   - Zero-token commands: /nb, /mascot, /nb-lang, /nb-scene (C14).
// The skills /grill-me, /challenge-me and /teach-me live in ../skills and need no code.
//
// Everything stays on the user's machine: the mod reads files in the workspace and calls no network.
import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, ThemeSetArgs } from 'claude-code'

import type { Bubble, ColleagueState, Lang, Level, TaskDecisions, Usage } from '../types'

import { bandSVG, bandText } from './band-svg.js'
import { ME_MISSING, nbInstruction, presetLine, STATE_WORDS, strip, UI, WELCOME_BOTH } from './colleague.js'
import { languageOf, languageOfText, parseDecisions, shellWriteTarget, progressOf, supportLevels } from './decisions.js'
import { makeColors } from './make-colors.js'
import { asciiSceneSVG } from './scene.js'
import { statusText } from './status.js'

type Dollar = EngineInterface

const stateAtom = atom({ plugin: 'nb', key: 'state' } as const, 'idle' as ColleagueState)
const busyAtom = atom({ plugin: 'nb', key: 'busy' } as const, 0)
const bubbleAtom = atom({ plugin: 'nb', key: 'bubble' } as const, { text: '', isStale: false } as Bubble, { shape: 'bubble-1' })
const usageAtom = atom({ plugin: 'nb', key: 'usage' } as const, { contextPercent: null, limit: null } as Usage, { shape: 'usage-1' })
const taskAtom = atom({ plugin: 'nb', key: 'task' } as const, null as TaskDecisions | null, { shape: 'task-1' })
const firstRunAtom = atom({ plugin: 'nb', key: 'isFirstRun' } as const, false)
const levelAtom = atom({ plugin: 'nb', key: 'level' } as const, 'normal' as Level)
const langAtom = atom({ plugin: 'nb', key: 'lang' } as const, 'en' as Lang)
const sceneAtom = atom({ plugin: 'nb', key: 'scene' } as const, true)
const langFixedAtom = atom({ plugin: 'nb', key: 'langFixed' } as const, false)
const askedAtom = atom({ plugin: 'nb', key: 'asked' } as const, false)

const SCENE = 'nb-dawn'
const STALE_MS = 15000
const LEVELS: readonly Level[] = ['quiet', 'normal', 'chatty']
const WRITES = new Set(['Write', 'Edit', 'MultiEdit', 'NotebookEdit'])


const COMMANDS = [
  { name: 'nb', description: 'NB: where your task stands, and the mod settings' },
  { name: 'mascot', description: 'NB: how much The Colleague talks', argumentHint: 'quiet|normal|chatty' },
  { name: 'nb-lang', description: 'NB: language of the mod (en or vi)', argumentHint: 'en|vi' },
  { name: 'nb-scene', description: 'NB: the ASCII scene behind the chat', argumentHint: 'on|off' },
]

// ---------- look: NB website tokens (design-system/tokens.css), dark ----------

const { theme: COLORS } = makeColors({
  label: 'No Babysitting',
  roles: { accent: '#d97a4a', danger: '#ee7a66', success: '#8cc084', warning: '#e2b04a', pro: '#8fb3d9' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#14120f',
        'surface-1': '#1c1916',
        'surface-2': '#211d19',
        'surface-3': '#241f1b',
        'text-primary': '#ede6da',
        'text-secondary': '#ada395',
        'text-muted': '#8d8376',
      },
    },
  },
  only: 'dark',
})

// Terminal brutalism from the NB design system: square boxes, 1px lines, one accent square as the mark.
// Messages sit on solid NB surfaces so the words keep their contrast over the scene.
const FRAME = 'M0.5 0.5H31.5V31.5H0.5Z'
const STYLE: ThemeSetArgs['style'] = {
  Heading: { fontFamily: ['mono'], fontWeight: 'semibold', letterSpacing: 0.5, color: '#ede6da' },
  // The person's message: a raised card with a hairline frame and the accent square ■ in its corner.
  UserMessage: {
    backgroundColor: '#1c1916',
    color: '#ede6da',
    paddingX: 16,
    paddingY: 12,
    fill: {
      vector: {
        viewBox: 32,
        slice: 8,
        paths: [
          { d: 'M0 0H32V32H0Z', color: '#1c1916' },
          { d: FRAME, strokeWidth: 1, color: '#3a332c' },
          { d: 'M0 0H5V5H0Z', color: '#d97a4a' },
          // A crop mark in the opposite corner: the card reads as a selection the person made.
          { d: 'M25.5 31.5H31.5V25.5', strokeWidth: 1, color: '#d97a4a' },
        ],
      },
    },
    // A hard offset shadow, no blur: paper on paper, the DS brutalist card.
    shadow: { x: 3, y: 3, blur: 0, color: '#0b0a08' },
  },
  // Claude's words: the page itself, with a quiet rule down the left, like a log in a terminal.
  AssistantMessage: {
    backgroundColor: '#14120f',
    color: '#ede6da',
    paddingLeft: 18,
    paddingRight: 14,
    paddingY: 10,
    fill: {
      vector: {
        viewBox: 32,
        slice: 8,
        paths: [
          { d: 'M0 0H32V32H0Z', color: '#14120ff2' },
          { d: 'M0 0H1V32H0Z', color: '#3a332c' },
          // The log's cursor: the rule starts with a short accent tick at the top of each run of words.
          { d: 'M0 0H2V6H0Z', color: '#d97a4a' },
        ],
      },
    },
  },
  ToolUse: { fontFamily: ['code'], color: '#ada395', backgroundColor: '#0f0d0b', borderColor: '#2e2924', borderWidth: 1, radius: 0, paddingX: 10 },
}

// Quiet, and only once the person turns the sound on: wind on the lake, a rare water drop, short cues.
// Pentatonic on D, so nothing ever clashes. Clicking the backdrop plays the scale left to right.
const SOUND: ThemeSetArgs['sound'] = {
  ambience: {
    layers: [
      { wave: 'brown', drone: true, gain: 0.12, filter: { type: 'lowpass', hz: 420, to: 700 } },
      { wave: 'bell', notes: ['D5', 'E5', 'A5', 'B5', 'D6'], scatter: 0.05, gain: 0.07, attack: 0.01, release: 3 },
    ],
    reverb: 0.45,
  },
  cues: {
    send: { layers: [{ wave: 'sine', notes: ['A5'], gain: 0.18, release: 0.25 }] },
    tool: { layers: [{ wave: 'white', gain: 0.06, filter: { type: 'highpass', hz: 5000 }, attack: 0.002, release: 0.03 }] },
    ask: { layers: [{ wave: 'triangle', notes: ['A4', 'D5'], step: 0.12, gain: 0.2, release: 0.5 }] },
    done: { layers: [{ wave: 'bell', notes: ['E5', 'A5'], step: 0.09, gain: 0.22, release: 1.6 }], reverb: 0.3 },
    error: { layers: [{ wave: 'triangle', notes: ['E4', 'C4'], step: 0.14, gain: 0.2, release: 0.5 }] },
    compact: { layers: [{ wave: 'pink', gain: 0.12, filter: { type: 'lowpass', hz: 2400, to: 300 }, attack: 0.2, release: 0.9 }] },
    click: { layers: [{ wave: 'bell', notes: ['D4', 'E4', 'G4', 'A4', 'B4', 'D5', 'E5'], gain: 0.16, release: 0.9 }], reverb: 0.2 },
  },
}

const GLASS = { blur: 0, tint: '#14120f', opacity: 0.18 } as const

function look(withScene: boolean): ThemeSetArgs {
  return {
    colors: COLORS,
    backdrop: withScene ? { scene: SCENE, glass: GLASS } : { color: '#14120f' },
    style: STYLE,
    sound: SOUND,
  } as ThemeSetArgs
}

async function applyLook($: Dollar): Promise<void> {
  const withScene = await read($, sceneAtom)

  try {
    const set = await $.theme.set(look(withScene))

    if (!set.isDrawn) {
      $.ui.log(`nb: theme not drawn: ${set.reason}`, { to: 'debug' })
    }
  } catch (error) {
    // An older build may refuse `sound` or `style`: drop them one at a time.
    $.ui.log(`nb: theme.set refused (${String(error)}); retrying without sound`, { to: 'debug' })
    const { sound: _sound, ...noSound } = look(withScene)

    try {
      await $.theme.set(noSound as ThemeSetArgs)
    } catch {
      const { style: _style, ...rest } = noSound

      await $.theme.set(rest as ThemeSetArgs).catch(() => undefined)
    }
  }
}

// ---------- workspace: me.md and the newest task ----------

async function readWorkspace($: Dollar): Promise<void> {
  const hasMe = await $.fs.exists('me.md').catch(() => false)

  if (hasMe) {
    const lang = languageOf(await $.fs.read('me.md').catch(() => ''))

    if (lang !== null && (await $.store.get('nb.lang')) === undefined) {
      await update($, langAtom, () => lang)
      await update($, langFixedAtom, () => true)
    }
  }
  await update($, firstRunAtom, () => !hasMe)
  await refreshTask($)
}

async function refreshTask($: Dollar): Promise<TaskDecisions | null> {
  const entries = await $.fs.list('tasks').catch(() => [])
  let best: { name: string; mtime: number } | null = null

  for (const entry of entries) {
    if (entry.kind !== 'dir') {
      continue
    }
    const stat = await $.fs.stat(`tasks/${entry.name}/decisions.md`).catch(() => null)

    if (stat !== null && (best === null || stat.mtimeMs > best.mtime)) {
      best = { name: entry.name, mtime: stat.mtimeMs }
    }
  }

  const task = best === null ? null : parseDecisions(await $.fs.read(`tasks/${best.name}/decisions.md`).catch(() => ''), best.name)

  await update($, taskAtom, () => task)

  return task
}

function summarize(u: any): Usage {
  const limits: { kind: string; percentUsed: number }[] = (u?.rateLimits ?? []).map((r: any) => ({
    kind: String(r.kind),
    percentUsed: Number(r.percentUsed),
  }))
  const limit = limits.length === 0 ? null : limits.reduce((a, b) => (b.percentUsed > a.percentUsed ? b : a))
  const percent = u?.context?.percent

  return { contextPercent: typeof percent === 'number' ? percent : null, limit }
}

async function loadSettings($: Dollar): Promise<void> {
  const savedLevel = await $.store.get('nb.level')
  const level = LEVELS.find(l => l === savedLevel)
  const lang = await $.store.get('nb.lang')
  const scene = await $.store.get('nb.scene')

  if (level !== undefined) {
    await update($, levelAtom, () => level)
  }
  if (lang === 'en' || lang === 'vi') {
    await update($, langAtom, () => lang)
    await update($, langFixedAtom, () => true)
  }
  if (typeof scene === 'boolean') {
    await update($, sceneAtom, () => scene)
  }
}

async function say($: Dollar, text: string): Promise<void> {
  await update($, bubbleAtom, () => ({ text, isStale: false }))
  if (text !== '') {
    $.clock.after(STALE_MS, () => {
      void update($, bubbleAtom, (b: Bubble) => (b.text === text ? { ...b, isStale: true } : b))
    })
  }
}

// ---------- commands (zero tokens) ----------

const VI_LEVEL: Record<Level, string> = { quiet: 'ít nói', normal: 'nói vừa phải', chatty: 'hay nói' }

async function runCommand($: Dollar, name: string, rawArgs: string): Promise<{ text: string }> {
  const arg = rawArgs.trim().toLowerCase()
  const lang = await read($, langAtom)
  const vi = lang === 'vi'

  if (name === 'mascot') {
    const level = LEVELS.find(l => l === arg)

    if (level === undefined) {
      const now = await read($, levelAtom)

      return { text: vi ? `The Colleague đang ${VI_LEVEL[now]} (${now}). Dùng /mascot quiet, normal hoặc chatty.` : `The Colleague is ${now}. Use /mascot quiet, normal or chatty.` }
    }
    await update($, levelAtom, () => level)
    await $.store.set('nb.level', level)
    if (level === 'quiet') {
      await say($, '')
    }

    return { text: vi ? `The Colleague giờ ${VI_LEVEL[level]}.` : `The Colleague is ${level} now.` }
  }

  if (name === 'nb-lang') {
    if (arg !== 'en' && arg !== 'vi') {
      return { text: vi ? 'NB đang nói tiếng Việt. Đổi bằng /nb-lang en hoặc /nb-lang vi.' : 'NB speaks English now. Change it with /nb-lang en or /nb-lang vi.' }
    }
    await update($, langAtom, () => arg)
    await update($, langFixedAtom, () => true)
    await $.store.set('nb.lang', arg)
    await say($, presetLine(arg, await read($, taskAtom), await read($, firstRunAtom)))

    return { text: arg === 'vi' ? 'Từ giờ NB nói tiếng Việt.' : 'NB speaks English now.' }
  }

  if (name === 'nb-scene') {
    if (arg !== 'on' && arg !== 'off') {
      const on = await read($, sceneAtom)

      return { text: vi ? `Cảnh nền đang ${on ? 'bật' : 'tắt'}. Dùng /nb-scene on hoặc off.` : `Scene is ${on ? 'on' : 'off'}. Use /nb-scene on or off.` }
    }
    await update($, sceneAtom, () => arg === 'on')
    await $.store.set('nb.scene', arg === 'on')
    await applyLook($)

    return { text: arg === 'on' ? (vi ? 'Đã bật cảnh nền.' : 'Scene on.') : vi ? 'Đã tắt cảnh nền.' : 'Scene off.' }
  }

  // /nb: where the task stands, and the settings.
  const task = await refreshTask($)
  const level = await read($, levelAtom)
  const scene = await read($, sceneAtom)
  // How much help each decision gets (me.md). The help fades as the user gets good at a decision (AGENTS.md).
  const me = (await $.fs.exists('me.md').catch(() => false)) ? await $.fs.read('me.md').catch(() => '') : null

  return { text: statusText({ lang, task, levels: me === null ? null : supportLevels(me), level, scene }) }
}

// ---------- hooks ----------

export const register: Register = on => {
  // One session.start hook (the engine refuses two on one event without a matcher).
  on('session.start', async ($, e, next) => {
    for (const command of COMMANDS) {
      await $.command.register(command)
    }
    await loadSettings($)
    await readWorkspace($)
    await update($, usageAtom, () => summarize(null))
    await $.session
      .usage()
      .then(async u => update($, usageAtom, () => summarize(u)))
      .catch(() => undefined)
    await applyLook($)
    if ((await read($, levelAtom)) !== 'quiet') {
      const task = await read($, taskAtom)
      const isFirstRun = await read($, firstRunAtom)
      const langKnown = await read($, langFixedAtom)

      await say($, isFirstRun && task === null && !langKnown ? WELCOME_BOTH : presetLine(await read($, langAtom), task, isFirstRun))
    }

    return next(e)
  }).catch(($, e, next) => next(e))

  on('session.measure', async ($, e, next) => {
    await update($, usageAtom, () => summarize(e))

    return next(e)
  }).catch(($, e, next) => next(e))

  // A new prompt: The Colleague starts reading, the bubble steps back, and Claude is told what the band shows.
  on('prompt.submit', async ($, e, next) => {
    if (e.command !== undefined || e.isMeta === true) {
      return next(e)
    }
    await update($, stateAtom, () => 'thinking' as ColleagueState)
    await say($, '')

    // No me.md language and no /nb-lang yet: the band speaks English until a message is clearly Vietnamese, then
    // Vietnamese for the rest of the session. A short "hi" or "ok" decides nothing (review O5-03).
    if (!(await read($, langFixedAtom)) && languageOfText(e.text ?? '') === 'vi') {
      await update($, langFixedAtom, () => true)
      await update($, langAtom, () => 'vi' as Lang)
    }

    // At "quiet" the bubble shows nothing, so Claude is not asked for a line nobody would see (P3, C14).
    if ((await read($, levelAtom)) === 'quiet') {
      return next(e)
    }

    return next({ ...e, context: [...(e.context ?? []), nbInstruction(await read($, langAtom), await read($, taskAtom))] })
  }).catch(($, e, next) => next(e))

  on('tool.call', async ($, e, next) => {
    if (e.tool === 'AskUserQuestion') {
      await update($, stateAtom, () => 'asking' as ColleagueState)
      const result = await next(e)

      await update($, stateAtom, () => 'thinking' as ColleagueState)

      return result
    }

    // M4: ask once what "done" means before the first write, only in this workspace and only when the task has none.
    const bashTarget = e.tool === 'Bash' ? shellWriteTarget(String((e as { command?: string }).command ?? '')) : null

    if ((WRITES.has(e.tool) || bashTarget !== null) && !(await read($, askedAtom))) {
      const path = bashTarget ?? String((e as { file_path?: string }).file_path ?? '')
      const task = await read($, taskAtom)
      const isOwnFile = /(^|[\\/])(decisions|me)\.md$/.test(path)
      const inWorkspace = await $.fs.exists('AGENTS.md').catch(() => false)

      if (!isOwnFile && inWorkspace && (task === null || (!task.made[1] && !task.skipped[1]))) {
        await update($, askedAtom, () => true)
        const ui = UI[await read($, langAtom)]

        await update($, stateAtom, () => 'asking' as ColleagueState)
        const answer = await $.ui.ask(ui.holdQuestion, { header: ui.holdHeader, options: [ui.holdReady, ui.holdNotYet, ui.holdNever] }).catch(() => ui.holdReady)

        await update($, stateAtom, () => 'thinking' as ColleagueState)
        if (answer === ui.holdNotYet) {
          return {
            deny: 'The user wants to say what "done" means before any file is written. Ask them in one short question, write their criteria into the task\'s decisions.md, then continue.',
          }
        }
      }
    }

    const busy = (await read($, busyAtom)) + 1

    await update($, busyAtom, () => busy)
    await update($, stateAtom, () => (busy > 2 ? 'overloaded' : 'working') as ColleagueState)
    try {
      const result = await next(e)

      // Safety net for AGENTS.md "First run" 5 (review F6-01): the agent has just recorded an acceptance in this
      // workspace and me.md is still missing, so the support levels would never start. Tell the agent, not the user.
      if (WRITES.has(e.tool) && /(^|[\\/])decisions\.md$/.test(String((e as { file_path?: string }).file_path ?? '')) && result.deny === undefined) {
        const task = await refreshTask($)
        const needsMe =
          task?.accepted === true && !(await $.fs.exists('me.md').catch(() => true)) && (await $.fs.exists('templates/me.md').catch(() => false))

        if (needsMe) {
          return { ...result, context: [...(result.context ?? []), ME_MISSING] }
        }
      }

      return result
    } finally {
      const left = Math.max(0, (await read($, busyAtom)) - 1)

      await update($, busyAtom, () => left)
      if (left === 0) {
        await update($, stateAtom, () => 'thinking' as ColleagueState)
      } else if (left <= 2) {
        await update($, stateAtom, () => 'working' as ColleagueState)
      }
    }
  }).catch(($, e, next) => (next.called ? next(e) : next(e)))

  // End of the main turn: read the task again, settle the face, and say at most one sentence.
  on('turn.complete', async ($, e, next) => {
    if (e.agentId !== undefined) {
      return next(e)
    }
    const before = await read($, taskAtom)
    const task = await refreshTask($)
    const hasMe = await $.fs.exists('me.md').catch(() => false)

    await update($, firstRunAtom, () => !hasMe)
    await update($, busyAtom, () => 0)
    const justAccepted = task !== null && task.accepted && !(before?.accepted === true && before.name === task.name)

    await update($, stateAtom, () => (justAccepted ? 'verified' : 'idle') as ColleagueState)

    const level = await read($, levelAtom)
    const { nb } = strip(e.answer)
    const lang = await read($, langAtom)
    const changed = JSON.stringify(before) !== JSON.stringify(task)
    const preset = presetLine(lang, task, !hasMe)
    const line = level === 'quiet' ? '' : nb !== null ? nb : level === 'chatty' || changed ? preset : ''

    if (!e.isAborted) {
      await say($, line)
    }

    return next(e)
  }).catch(($, e, next) => next(e))

  // The reply is drawn without its <nb> line (the saved transcript keeps it).
  on('ui.render', { component: 'AssistantMessage' }, async ($, e, next) => {
    const { text } = strip(e.props.text)

    return text === e.props.text ? next(e) : next({ ...e, props: { ...e.props, text } })
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || (e.surface !== 'desktop' && e.surface !== 'terminal')) {
      return next(e)
    }
    const model = {
      state: await read($, stateAtom),
      line: (await read($, levelAtom)) === 'quiet' ? '' : (await read($, bubbleAtom)).text,
      isStale: (await read($, bubbleAtom)).isStale,
      decisions: await read($, taskAtom),
      contextPercent: (await read($, usageAtom)).contextPercent,
      limit: (await read($, usageAtom)).limit,
      lang: await read($, langAtom),
    }

    if (model.state === 'asking') {
      model.line = '' // silent while the user decides
    }

    if (e.surface === 'desktop') {
      const { Svg } = $.ui.resolve(e)

      return <Svg source={bandSVG(model)} alt={`The Colleague: ${STATE_WORDS[model.lang][model.state]}. ${model.line}`} />
    }

    const { Box, Text } = $.ui.resolve(e)
    const t = bandText(model)

    return (
      <Box flexDirection="column">
        <Box flexDirection="row" gap={2}>
          <Text bold color={t.color}>
            {t.face}
          </Text>
          {t.line !== '' && <Text>{t.line}</Text>}
        </Box>
        <Box flexDirection="row" gap={3}>
          <Text dimColor>{t.strip}</Text>
          {t.meter !== '' && <Text dimColor>{t.meter}</Text>}
        </Box>
      </Box>
    )
  })

  // The scene is redrawn only when the share of decisions made changes. It then converges once from the
  // previous share to the new one (M11, noise to order); the first draw of a session converges from nothing.
  let shown: { progress: number; source: string } | null = null

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== SCENE) {
      return next(e)
    }
    const progress = Math.round(progressOf(await read($, taskAtom)) * 4) / 4

    if (shown === null || shown.progress !== progress) {
      shown = { progress, source: asciiSceneSVG({ progress, from: shown === null ? 0 : shown.progress }) }
    }
    const source = shown.source
    const { Svg } = $.ui.resolve(e)

    return <Svg source={source} alt="A lake among hills drawn in coloured characters. Noise turns into the picture, and the sun rises, as you make your decisions." isInteractive />
  })

  // One hook per command, each with a literal matcher, so other mods' commands pass untouched.
  on('command.run', { command: 'nb' }, async ($, e) => runCommand($, 'nb', e.args)).catch(($, e, next) => next(e))
  on('command.run', { command: 'mascot' }, async ($, e) => runCommand($, 'mascot', e.args)).catch(($, e, next) => next(e))
  on('command.run', { command: 'nb-lang' }, async ($, e) => runCommand($, 'nb-lang', e.args)).catch(($, e, next) => next(e))
  on('command.run', { command: 'nb-scene' }, async ($, e) => runCommand($, 'nb-scene', e.args)).catch(($, e, next) => next(e))
}
