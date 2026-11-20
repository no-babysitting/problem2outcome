// The band above the prompt on Desktop, drawn as one SVG: The Colleague, its speech bubble,
// the task's four decisions and a calm context meter. Pure: returns a string.
//
// Motion is CSS inside the SVG and runs once per state change (the band is redrawn only then):
// the face changes by a 0.35 s scramble (DS M14), the "your turn" cursor blinks, the working tail pulses.

import type { ColleagueState, Lang, TaskDecisions } from '../types'

import { DECISION_WORDS, FACES, NB, STATE_WORDS, UI } from './colleague.js'

export type BandModel = {
  state: ColleagueState
  /** The bubble's sentence, or '' for none. */
  line: string
  /** The sentence is older than a few seconds: drawn quieter. */
  isStale: boolean
  decisions: TaskDecisions | null
  contextPercent: number | null
  limit: { kind: string; percentUsed: number } | null
  lang: Lang
}

export const BAND_W = 720
export const BAND_H = 76

const MONO = `'JetBrains Mono',ui-monospace,'SF Mono',Menlo,Consolas,monospace`
const SANS = `'Be Vietnam Pro',system-ui,'Segoe UI',Roboto,sans-serif`
const CIRCLED = ['①', '②', '③', '④']
const NOISE = '#%&/\\<>=+*?!'

export const xml = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Rough width of sans text at 13 px; wide enough that the bubble never cuts a word. */
const sansWidth = (s: string): number => [...s].reduce((w, ch) => w + (/[A-ZĐ@MW]/.test(ch) ? 8.6 : /[ il.,:;'!|]/.test(ch) ? 3.6 : 7), 0)

/** Breaks the sentence into at most two lines of about `max` px each. */
export function wrap(text: string, max: number): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = ['']

  for (const word of words) {
    const cur = lines[lines.length - 1]
    const next = cur === '' ? word : `${cur} ${word}`

    if (sansWidth(next) <= max || cur === '') {
      lines[lines.length - 1] = next
    } else if (lines.length < 2) {
      lines.push(word)
    } else {
      lines[1] = `${(lines[1] ?? '').replace(/[\s.,;:]*$/, '')}…`
      break
    }
  }

  return lines.filter(l => l !== '')
}

/** Two scrambled faces before the real one: same frame `[_]`, noise in the eyes. Deterministic per state. */
const scrambles = (state: ColleagueState): [string, string] => {
  const seed = [...state].reduce((a, c) => a + c.charCodeAt(0), 0)
  const g = (k: number): string => NOISE.charAt((seed * 7 + k * 13) % NOISE.length)

  return [`[${g(1)}_${g(2)}]`, `[${g(3)}${g(4)}${g(5)}]`]
}

const meter = (percent: number): string => {
  const cells = 10
  const full = Math.max(0, Math.min(cells, Math.round((percent / 100) * cells)))

  return '█'.repeat(full) + '░'.repeat(cells - full)
}

export function bandSVG(m: BandModel): string {
  const f = FACES[m.state]
  const words = DECISION_WORDS[m.lang]
  const ui = UI[m.lang]
  const [s1, s2] = scrambles(m.state)

  // ---- row 1: face and bubble ----
  const faceX = 12
  const faceY = 30
  const bubbleX = 112
  const lines = m.line === '' ? [] : wrap(m.line, 440)
  const bw = lines.length === 0 ? 0 : Math.ceil(Math.max(...lines.map(sansWidth))) + 28
  const bh = lines.length === 2 ? 44 : 30
  const by = lines.length === 2 ? 2 : 9
  const bubble =
    lines.length === 0
      ? ''
      : `<g class="bub${m.isStale ? ' stale' : ''}">` +
        `<path d="M${bubbleX} ${by}h${bw}v${bh}h-${bw}v${bh / 2 - 6}l-9 6 9 6z" fill="${NB.bgRaised}" fill-opacity=".94" stroke="${NB.line}"/>` +
        lines
          .map((l, i) => `<text x="${bubbleX + 14}" y="${by + (lines.length === 2 ? 18 + i * 17 : 20)}" class="say">${xml(l)}</text>`)
          .join('') +
        `</g>`

  // ---- row 2: the four decisions, then the context meter ----
  // One <text> with tspans: the browser lays the labels out, so wide glyphs (①, Vietnamese marks) never collide.
  const d = m.decisions
  let strip = ''

  if (d === null) {
    strip = `<text x="12" y="66" class="mono quiet">${xml(ui.noTask)}</text>`
  } else {
    const spans: string[] = []

    for (let i = 0; i < 4; i++) {
      if (!d.applies[i]) {
        continue
      }
      const isNext = d.next === i + 1
      const made = d.made[i]
      const cls = made ? 'done' : isNext ? 'next' : 'later'
      const gap = spans.length === 0 ? '' : ' dx="16"'

      spans.push(`<tspan${gap} class="${cls}">${xml(`${CIRCLED[i]} ${words[i]}`)}</tspan>`)
      if (made) {
        spans.push(`<tspan dx="5" class="ok">${i === 3 && d.redo ? '↺' : '✓'}</tspan>`)
      } else if (isNext) {
        spans.push(`<tspan dx="3" class="cur">▍</tspan>`)
      }
    }
    strip = `<text x="12" y="66" class="mono">${spans.join('')}</text>`
  }

  const ctx = m.contextPercent
  const lim = m.limit
  const meterText =
    ctx === null
      ? ''
      : `${ui.context} ${meter(ctx)} ${Math.round(ctx)}%` +
        (lim === null ? '' : `  ·  ${lim.kind === 'five_hour' ? '5h' : lim.kind === 'seven_day' ? '7d' : lim.kind} ${Math.round(lim.percentUsed)}%`)
  const meterSvg = meterText === '' ? '' : `<text x="${BAND_W - 12}" y="66" text-anchor="end" class="mono quiet">${xml(meterText)}</text>`

  const css =
    `.mono{font:600 11.5px ${MONO}}.say{font:400 13px ${SANS};fill:${NB.fg}}` +
    `.face{font:600 21px ${MONO};fill:${f.color}}.tail{font:600 17px ${MONO};fill:${f.color}}` +
    `.done{fill:${NB.fgMuted}}.ok{fill:${NB.signal};font-weight:700}.next{fill:${NB.fg}}.cur{fill:${NB.accent};animation:blink 1.1s steps(1,end) infinite}` +
    `.later,.quiet{fill:${NB.fgSubtle}}.stale{opacity:.62}` +
    `.sc{opacity:0}.sc0{animation:sc0 .35s steps(1,end) 1 both}.sc1{animation:sc1 .35s steps(1,end) 1 both}` +
    `.real{animation:real .35s steps(1,end) 1 both}` +
    `.pulse{animation:pulse 1.4s ease-in-out infinite alternate}` +
    `@keyframes sc0{0%{opacity:1}33%{opacity:0}}@keyframes sc1{0%{opacity:0}33%{opacity:1}66%{opacity:0}}` +
    `@keyframes real{0%{opacity:0}66%{opacity:1}100%{opacity:1}}@keyframes blink{50%{opacity:0}}@keyframes pulse{from{fill-opacity:.45}to{fill-opacity:1}}` +
    `@media (prefers-reduced-motion:reduce){.sc0,.sc1{animation:none;opacity:0}.real,.cur,.pulse{animation:none;opacity:1;fill-opacity:1}}`

  const tailCls = m.state === 'working' || m.state === 'thinking' ? 'tail pulse' : 'tail'
  const alt = `${f.face}${f.tail} ${STATE_WORDS[m.lang][m.state]}`

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${BAND_W}" height="${BAND_H}" viewBox="0 0 ${BAND_W} ${BAND_H}" role="img" aria-label="${xml(alt)}">` +
    `<style>${css}</style>` +
    `<rect width="${BAND_W}" height="${BAND_H}" fill="${NB.bg}" fill-opacity=".86"/>` +
    `<text x="${faceX}" y="${faceY}" class="face sc sc0">${xml(s1)}</text>` +
    `<text x="${faceX}" y="${faceY}" class="face sc sc1">${xml(s2)}</text>` +
    `<g class="real"><text x="${faceX}" y="${faceY}" class="face">${xml(f.face)}` +
    (f.tail === '' ? '' : `<tspan dx="2" class="${tailCls}">${xml(f.tail)}</tspan>`) +
    `</text></g>` +
    bubble +
    `<line x1="12" x2="${BAND_W - 12}" y1="47.5" y2="47.5" stroke="${NB.line}" stroke-dasharray="2 4"/>` +
    strip +
    meterSvg +
    `</svg>`
  )
}

/** The same band as plain text, for the terminal (one or two lines). */
export function bandText(m: BandModel): { face: string; color: string; line: string; strip: string; meter: string } {
  const f = FACES[m.state]
  const words = DECISION_WORDS[m.lang]
  const d = m.decisions
  const strip =
    d === null
      ? UI[m.lang].noTask
      : [0, 1, 2, 3]
          .filter(i => d.applies[i])
          .map(i => `${CIRCLED[i]} ${words[i]}${d.made[i] ? ' ✓' : d.next === i + 1 ? ' ▍' : ''}`)
          .join('   ')
  const ctx = m.contextPercent

  return {
    face: `${f.face}${f.tail}`,
    color: f.color,
    line: m.line,
    strip,
    meter: ctx === null ? '' : `${UI[m.lang].context} ${meter(ctx)} ${Math.round(ctx)}%`,
  }
}
