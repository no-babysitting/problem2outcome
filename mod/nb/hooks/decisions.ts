// Reads a task's decisions.md (the workspace template) into what the band shows. Pure: no $, no I/O.
//
// A decision counts as made when its section holds the user's words: anything besides HTML comments,
// empty checkboxes and the template's own placeholder text.

import type { Size, TaskDecisions } from '../types'

const PLACEHOLDER = /^(<short name>|accepted on first try \| redo \(why\)|small \| larger)$/i

const stripComments = (text: string): string => text.replace(/<!--[\s\S]*?-->/g, '')

const meaningful = (line: string): boolean => {
  const t = line
    .trim()
    .replace(/^[-*]\s*(\[[ xX]\]\s*)?/, '')
    .trim()

  return t !== '' && !PLACEHOLDER.test(t)
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

  const made: [boolean, boolean, boolean, boolean] = [
    body[0].split('\n').some(meaningful),
    body[1].split('\n').some(meaningful),
    body[2].split('\n').some(meaningful),
    accepted || redo,
  ]
  const applies: [boolean, boolean, boolean, boolean] = size === 'small' ? [false, true, false, true] : [true, true, true, true]
  const idx = [0, 1, 2, 3].find(i => applies[i] && !made[i])

  return { name, size, made, applies, accepted, redo, next: idx === undefined ? null : ((idx + 1) as 1 | 2 | 3 | 4) }
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
