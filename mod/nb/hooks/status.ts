// The /nb command's text, kept pure so the browser preview draws the same thing. Same layout language as the
// band (v3): uppercase labels, a [k] key per decision, `·` between fields.
import type { Lang, Level, TaskDecisions } from '../types'

import { DECISION_WORDS } from './colleague.js'
import type { supportLevels } from './decisions.js'

type Support = ReturnType<typeof supportLevels>

/** Support level names for /nb. English as AGENTS.md and me.md write them; Vietnamese glosses. */
const SUPPORT_WORDS: Record<Lang, Record<'guide' | 'challenge' | 'record', string>> = {
  en: { guide: 'Guide', challenge: 'Challenge', record: 'Record' },
  vi: { guide: 'mình dẫn', challenge: 'bạn viết trước', record: 'bạn tự quyết' },
}

export type StatusInput = {
  lang: Lang
  task: TaskDecisions | null
  /** Levels read from me.md, or null when me.md does not exist yet. */
  levels: Support | null
  level: Level
  scene: boolean
}

/** One row per decision that applies: its key (✓ made, ↺ redo, – skipped, else its number), label and note. */
export function statusRows(lang: Lang, task: TaskDecisions): { key: string; label: string; note: string; isNext: boolean }[] {
  const vi = lang === 'vi'

  return [0, 1, 2, 3]
    .filter(i => task.applies[i])
    .map(i => {
      const redo = i === 3 && task.made[i] && task.redo
      const isNext = !task.made[i] && !task.skipped[i] && task.next === i + 1

      return {
        key: redo ? '↺' : task.made[i] ? '✓' : task.skipped[i] ? '–' : String(i + 1),
        label: DECISION_WORDS[lang][i] ?? '',
        note: redo ? (vi ? 'làm lại' : 'redo') : task.skipped[i] ? (vi ? 'bỏ qua' : 'skipped') : isNext ? (vi ? '▍ lượt bạn' : '▍ your turn') : '',
        isNext,
      }
    })
}

export function statusText(s: StatusInput): string {
  const vi = s.lang === 'vi'
  const up = (t: string): string => t.toLocaleUpperCase(vi ? 'vi' : 'en')
  const words = DECISION_WORDS[s.lang]
  const lines: string[] = []

  if (s.task === null) {
    lines.push(`${up(vi ? 'Việc' : 'Task')} · ${vi ? 'chưa có việc nào trong tasks/. Cứ nói với Claude việc bạn muốn làm.' : 'no task in tasks/ yet. Just tell Claude what you want done.'}`)
  } else {
    const rows = statusRows(s.lang, s.task)
    // Counted as the band counts: made (✓ or ↺), not skipped (review F9-03).
    const done = rows.filter(r => r.key === '✓' || r.key === '↺').length

    lines.push(`${up(vi ? 'Việc' : 'Task')} · ${s.task.name} · ${done}/${rows.length}`)
    for (const r of rows) {
      lines.push(`[${r.key}] ${up(r.label)}${r.note === '' ? '' : ` · ${r.note}`}`)
    }
  }

  // How much help each decision gets (me.md). The help fades as the user gets good at a decision (AGENTS.md).
  const help = `${up(vi ? 'Mức hỗ trợ' : 'Help level')} (me.md)`

  lines.push('')
  if (s.levels === null) {
    lines.push(`${help} · ${vi ? 'sẽ có sau việc đầu tiên bạn nghiệm thu.' : 'made after you accept your first task.'}`)
  } else if (s.levels.some(l => l !== null)) {
    lines.push(`${help} · ${s.levels.map((l, i) => `${words[i]}: ${l === null ? '?' : SUPPORT_WORDS[s.lang][l]}`).join(' · ')}`)
  }
  lines.push(`${up(vi ? 'Cài đặt' : 'Settings')} · /mascot ${s.level} · /nb-lang ${s.lang} · /nb-scene ${s.scene ? 'on' : 'off'}`)
  lines.push(
    `${up(vi ? 'Kỹ năng' : 'Skills')} · ` +
      (vi
        ? '/grill-me hỏi vặn cho rõ việc · /challenge-me phản biện quyết định của bạn · /teach-me tóm tắt tài liệu chính thức'
        : '/grill-me sharpen the task · /challenge-me argue against your decision · /teach-me the official docs, in a few lines'),
  )

  return lines.join('\n')
}
