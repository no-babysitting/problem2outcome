// Reads a task's decisions.md (the workspace template) into what the band shows. Pure: no $, no I/O.
//
// Decisions 1 to 3 count as made only when their section says `Confirmed: yes`, which the agent writes after the
// user confirms in their own words (AGENTS.md). Words in a section prove nothing: a draft, or a placeholder such as
// "(chưa đặt)", is not a decision. `Confirmed: skipped` is a pause the user asked to skip. Decision 4 is the
// `Decision:` line, which only the user's accept or redo sets.

import type { Size, TaskDecisions } from '../types'

const PLACEHOLDER = /^(<short name>|accepted on first try \| redo \(why\)|small \| larger)$/i

const stripComments = (text: string): string => text.replace(/<!--[\s\S]*?-->/g, '')

/** The section's `Confirmed:` value: yes, skipped, or no (also when the line is missing). */
const confirmed = (section: string): 'yes' | 'skipped' | 'no' => {
  const v = /^\s*(?:[-*]\s*)?Confirmed:[ \t]*(\w+)/im.exec(section)?.[1]?.toLowerCase() ?? ''

  return v === 'yes' ? 'yes' : v === 'skipped' || v === 'skip' ? 'skipped' : 'no'
}

/** Splits the file into the body of each `## N.` section. */
const sections = (text: string): [string, string, string, string] => {
  const out: [string, string, string, string] = ['', '', '', '']
  let at = -1

  for (const line of text.split(/\r?\n/)) {
    const h = /^##\s*([1-4])\b/.exec(line)

    if (h !== null) {
      at = Number(h[1]) - 1
      continue
    }
    if (/^#{1,2}\s/.test(line)) {
      at = -1
      continue
    }
    if (at >= 0) {
      out[at as 0 | 1 | 2 | 3] += `${line}\n`
    }
  }

  return out
}

const field = (text: string, name: string): string | null => {
  const m = new RegExp(`(?:^|[\\s·|])${name}:[ \\t]*([^\\n·]*)`, 'i').exec(text)
  const v = m?.[1]?.trim() ?? ''

  return v === '' || PLACEHOLDER.test(v) ? null : v
}

export function parseDecisions(text: string, folder = ''): TaskDecisions {
  const clean = stripComments(text)
  const title = /^#\s*Task:\s*(.+)$/im.exec(clean)?.[1]?.trim()
  const name = title !== undefined && !PLACEHOLDER.test(title) ? title : folder.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/-/g, ' ')
  const sizeText = field(clean, 'Size')?.toLowerCase() ?? ''
  const size: Size = sizeText.startsWith('small') ? 'small' : sizeText.startsWith('larger') || sizeText.startsWith('large') ? 'larger' : 'unknown'
  const body = sections(clean)

  const decision = field(body[3], 'Decision')?.toLowerCase() ?? ''
  const accepted = decision.startsWith('accept')
  const redo = decision.startsWith('redo')

  const state = [confirmed(body[0]), confirmed(body[1]), confirmed(body[2])]
  const made: [boolean, boolean, boolean, boolean] = [state[0] === 'yes', state[1] === 'yes', state[2] === 'yes', accepted || redo]
  const skipped: [boolean, boolean, boolean, boolean] = [state[0] === 'skipped', state[1] === 'skipped', state[2] === 'skipped', false]
  const applies: [boolean, boolean, boolean, boolean] = size === 'small' ? [false, true, false, true] : [true, true, true, true]
  const idx = [0, 1, 2, 3].find(i => applies[i] && !made[i] && !skipped[i])

  return { name, size, made, skipped, applies, accepted, redo, next: idx === undefined ? null : ((idx + 1) as 1 | 2 | 3 | 4) }
}

/** Share of the decisions that apply which are made, 0..1. Drives how high the sun stands. */
export const progressOf = (d: TaskDecisions | null): number => {
  if (d === null) {
    return 0
  }
  const total = d.applies.filter(Boolean).length
  const done = d.applies.filter((a, i) => a && d.made[i]).length

  return total === 0 ? 0 : done / total
}

/** `Language: vi` (or a word such as Vietnamese / Tiếng Việt) in me.md. */
export function languageOf(meText: string): 'en' | 'vi' | null {
  const v = field(stripComments(meText), 'Language')?.toLowerCase() ?? ''

  if (v === '') {
    return null
  }

  return /^(vi|viet|tiếng việt|tieng viet)/.test(v) ? 'vi' : 'en'
}

/**
 * The file a shell command writes with `>`, `>>` or `tee`, or null. A rough reading on purpose: it only decides
 * whether to ask "what counts as done?" once, so a miss costs nothing and the agreement in AGENTS.md still holds.
 */
export function shellWriteTarget(command: string): string | null {
  // Blank out quoted text first, so a ">" inside a string ("%h > %s", x => x + 1) is not taken for a redirect.
  // The quotes stay, so a quoted target after a real ">" is still found in the original command.
  const bare = command.replace(/'[^']*'|"(?:\\.|[^"\\])*"/g, q => q[0] + ' '.repeat(q.length - 2) + q[0])
  const redirect = /(?:^|[^0-9&>=\-])>{1,2}\s*(['"]?)/.exec(bare)
  const tee = /\btee\s+(?:-a\s+)?(['"]?)/.exec(bare)
  const at = redirect !== null ? redirect.index + redirect[0].length : tee !== null ? tee.index + tee[0].length : -1

  if (at < 0) {
    return null
  }

  const quote = (redirect ?? tee)?.[1] ?? ''
  const rest = command.slice(at)
  const target = (quote !== '' ? rest.slice(0, Math.max(0, rest.indexOf(quote))) : /^[^\s|&;<>]+/.exec(rest)?.[0]) ?? ''

  return target === '' || target.startsWith('/dev/') ? null : target
}
