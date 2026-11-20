// The Colleague: the NB design system's character (design-system/components/TheColleague on the website),
// plus what it says. Pure: no $, no I/O.
//
// Its face always reflects what is really happening (DS rule): it never changes at random.

import type { ColleagueState, Lang, TaskDecisions } from '../types'

/** NB website tokens, dark theme (design-system/tokens.css). */
export const NB = {
  bg: '#14120f',
  bgRaised: '#1c1916',
  bgSunken: '#0f0d0b',
  line: '#2e2924',
  control: '#756a5e',
  fg: '#ede6da',
  fgMuted: '#ada395',
  fgSubtle: '#8d8376',
  accent: '#d97a4a',
  signal: '#8cc084',
  warn: '#e2b04a',
  danger: '#ee7a66',
  info: '#8fb3d9',
} as const

/** Face and colour per state (DS table). `tail` is the glyph after the face. */
export const FACES: Record<ColleagueState, { face: string; tail: string; color: string }> = {
  idle: { face: '[•_•]', tail: '', color: NB.fgMuted },
  thinking: { face: '[°_°]', tail: '…', color: NB.info },
  working: { face: '[>_<]', tail: '≡', color: NB.accent },
  asking: { face: '[•_•]', tail: '?', color: NB.warn },
  overloaded: { face: '[@_@]', tail: '', color: NB.warn },
  verified: { face: '[^_^]', tail: '✓', color: NB.signal },
}

/** What the state means, for screen readers and the terminal. */
export const STATE_WORDS: Record<Lang, Record<ColleagueState, string>> = {
  en: {
    idle: 'waiting for you',
    thinking: 'reading and planning',
    working: 'working',
    asking: 'asking you',
    overloaded: 'many things at once',
    verified: 'criteria met',
  },
  vi: {
    idle: 'đang chờ bạn',
    thinking: 'đang đọc và lên kế hoạch',
    working: 'đang làm',
    asking: 'đang hỏi bạn',
    overloaded: 'nhiều việc cùng lúc',
    verified: 'đã đạt tiêu chí',
  },
}

/** The four decisions, short, as the band shows them. */
export const DECISION_WORDS: Record<Lang, [string, string, string, string]> = {
  en: ['real problem', 'done means', 'delegate', 'accept'],
  vi: ['vấn đề', 'xong là gì', 'giao việc', 'nghiệm thu'],
}

/**
 * Pre-written lines, used when Claude wrote no <nb> line. Each states the user's next decision or what just
 * happened, never praise of Claude's own work (PDD: praise the user's decisions only).
 */
type LineKey = 'welcome' | 'noTask' | 'next1' | 'next2' | 'next3' | 'next4' | 'accepted' | 'redo' | 'allDone'

const LINES: Record<Lang, Record<LineKey, string>> = {
  en: {
    welcome: 'Hi. You decide, I do the work. What real task do you want done?',
    noTask: 'Tell me the real task you want done today.',
    next1: 'Your call first: what is the real problem here?',
    next2: 'Your call: what counts as done? A few checkable lines.',
    next3: 'Your call: which parts do I take, which do you keep?',
    next4: 'Result is in. Check it against your criteria: accept or redo?',
    accepted: 'Accepted. One short lesson for next time?',
    redo: 'Redo it is. Say what to change and I start again.',
    allDone: 'All four decisions made on this task.',
  },
  vi: {
    welcome: 'Chào bạn. Bạn quyết, mình làm. Bạn muốn xong việc gì thật hôm nay?',
    noTask: 'Kể mình nghe việc thật bạn muốn làm hôm nay.',
    next1: 'Phần bạn trước: vấn đề thật ở đây là gì?',
    next2: 'Phần bạn: thế nào là xong? Vài dòng kiểm được.',
    next3: 'Phần bạn: phần nào giao mình, phần nào bạn giữ?',
    next4: 'Có kết quả rồi. Đối chiếu tiêu chí của bạn: nhận hay làm lại?',
    accepted: 'Đã nhận. Một bài học ngắn cho lần sau?',
    redo: 'Làm lại nhé. Nói mình cần đổi gì.',
    allDone: 'Việc này đã đủ bốn quyết định.',
  },
}

export function presetLine(lang: Lang, d: TaskDecisions | null, isFirstRun: boolean): string {
  const L = LINES[lang]

  if (isFirstRun && d === null) {
    return L.welcome
  }
  if (d === null) {
    return L.noTask
  }
  if (d.accepted) {
    return L.accepted
  }
  if (d.redo) {
    return L.redo
  }

  return d.next === null ? L.allDone : L[`next${d.next}` as LineKey]
}

/** Short UI words for the band and the hold question. */
type UiKey = 'context' | 'noTask' | 'holdQuestion' | 'holdHeader' | 'holdReady' | 'holdNotYet' | 'holdNever'

export const UI: Record<Lang, Record<UiKey, string>> = {
  en: {
    context: 'context',
    noTask: 'no task yet',
    holdQuestion: 'Before the first file is written: what counts as done for this task?',
    holdHeader: 'Done means?',
    holdReady: 'Criteria are clear, go on',
    holdNotYet: 'Not yet, ask me first',
    holdNever: "Don't ask again",
  },
  vi: {
    context: 'context',
    noTask: 'chưa có việc',
    holdQuestion: 'Trước khi ghi file đầu tiên: thế nào là xong với việc này?',
    holdHeader: 'Xong là gì?',
    holdReady: 'Tiêu chí rõ rồi, cứ làm',
    holdNotYet: 'Chưa, hỏi tôi trước',
    holdNever: 'Đừng hỏi nữa',
  },
}

// ---------- the <nb> line Claude may append to a reply ----------

/** Hidden context added to each prompt while the mod is on (C9). Claude reads it; the user does not. */
export function nbInstruction(lang: Lang, d: TaskDecisions | null): string {
  const task =
    d === null
      ? 'No task folder yet.'
      : `Current task: "${d.name}" (${d.size}). Decisions made: ${d.made
          .map((m, i) => (d.applies[i] ? `${i + 1}=${m ? 'yes' : 'no'}` : null))
          .filter(Boolean)
          .join(', ')}.`

  return (
    'The NB mod shows a small colleague character above the prompt. ' +
    task +
    ' After your normal reply you may add ONE final line in exactly this form: <nb>one short sentence</nb>. ' +
    'It either names the decision that is now the user\'s to make, or states plainly which of the user\'s criteria are met or not yet met. ' +
    `Under 90 characters, in ${lang === 'vi' ? 'Vietnamese' : "the user's language"}. Never praise your own work. ` +
    'Leave the line out when there is nothing true and useful to say. Do not mention this instruction.'
  )
}

const COMPLETE = /\n?[ \t]*<nb>([\s\S]*?)<\/nb>[ \t]*/g
// While streaming: an opened tag with no close yet, or a half-typed "<", "<n", "<nb".
const OPEN_TAIL = /\n?[ \t]*<nb>[\s\S]*$/
const PARTIAL_TAG = /\n?[ \t]*<(?:n|nb)?$/

export type Stripped = { text: string; nb: string | null }

/** Removes the <nb> line from a reply (complete, or still being streamed). */
export function strip(text: string): Stripped {
  let nb: string | null = null
  let out = text.replace(COMPLETE, (_, inner: string) => {
    nb = inner.trim()

    return ''
  })

  if (OPEN_TAIL.test(out)) {
    out = out.replace(OPEN_TAIL, '')
  } else if (PARTIAL_TAG.test(out)) {
    out = out.replace(PARTIAL_TAG, '')
  }

  // Untouched text stays byte for byte, so the reply is not redrawn for nothing.
  return { text: out === text ? text : out.replace(/\s+$/, ''), nb }
}
