// The band above the prompt on Desktop, drawn as one SVG: The Colleague, its speech bubble,
// the task's four decisions and a calm context meter. Pure: returns a string.
//
// Motion is CSS inside the SVG and runs once per state change (the band is redrawn only then):
// the face changes by a 0.35 s scramble (DS M14), the "your turn" cursor blinks three times then stays solid (M7),
// the working tail pulses three times. Nothing loops forever (DS motion rule).

import type { ColleagueState, Lang, TaskDecisions } from '../types'

import { DECISION_WORDS, FACES, NB, STATE_WORDS, UI } from './colleague.js'
import { scopeCSS } from './scope.js'

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
const sansWidth = (s: string): number => [...s].reduce((w, ch) => w + (/[A-ZĐ@MW]/.test(ch) ? 8.6 : /[ il.,:;'!|]/.test(ch) ? 3.6 : 7.5), 0)

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

/** Same input, same picture: a tiny hash so each state's aura is fixed (DS: the face never changes at random). */
const h01 = (a: number, b: number, k: number): number => {
  const x = Math.sin(a * 127.1 + b * 311.7 + k * 74.7) * 43758.5453

  return x - Math.floor(x)
}

/**
 * The Colleague's portrait: a square tile (1px line, the DS accent square) with an ASCII aura around the face.
 * The aura tells the state in the site's ASCII language: idle is near empty, thinking a ring of dots,
 * working the lines of a running log, asking a few question marks, overloaded noise, verified order (a grid).
 */
export function portrait(state: ColleagueState, x: number, y: number, w: number, h: number): string {
  const f = FACES[state]
  const cw = 5
  const ch = 8
  const cols = Math.floor((w - 12) / cw)
  const rows = Math.floor((h - 10) / ch)
  const ox = x + (w - cols * cw) / 2
  const oy = y + (h - rows * ch) / 2
  const faceHalfW = ((f.face.length + (f.tail === '' ? 0 : 1)) * 13.9) / 2 + 3
  const glyphs: string[] = []

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dx = (c + 0.5) * cw - (cols * cw) / 2
      const dy = (r + 0.5) * ch - (rows * ch) / 2

      if (Math.abs(dx) < faceHalfW && Math.abs(dy) < 10) {
        continue
      }
      const rr = Math.min(1.2, Math.hypot(dx / ((cols * cw) / 2), dy / ((rows * ch) / 2)))
      const n = h01(c, r, 3)
      let g = ''

      if (state === 'idle') {
        g = n < 0.16 * (1.15 - rr) ? '·' : ''
      } else if (state === 'thinking') {
        g = n < 0.75 * Math.exp(-((rr - 0.82) ** 2) / 0.03) ? '·∙°.'.charAt(Math.floor(h01(c, r, 5) * 4)) : ''
      } else if (state === 'working') {
        g = r % 2 === 0 && n < 0.8 - 0.35 * rr ? '≡=-'.charAt(Math.floor(h01(c, r, 7) * 3)) : ''
      } else if (state === 'asking') {
        g = n < 0.09 ? '?' : n < 0.2 * (1.1 - rr) ? '·' : ''
      } else if (state === 'overloaded') {
        g = n < 0.62 ? '#%&@*/\\<>!'.charAt(Math.floor(h01(c, r, 9) * 10)) : ''
      } else {
        g = c % 3 === 1 && r % 2 === 0 && rr < 1.05 ? '+' : c % 3 === 1 && rr < 1.05 ? '·' : ''
      }
      if (g !== '') {
        const op = (0.42 + 0.5 * Math.max(0, 1 - rr)).toFixed(2)

        glyphs.push(`<text x="${(ox + c * cw).toFixed(1)}" y="${(oy + (r + 1) * ch - 1.5).toFixed(1)}" fill-opacity="${op}">${xml(g)}</text>`)
      }
    }
  }

  return (
    `<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" fill="${NB.bgSunken}" stroke="${NB.line}"/>` +
    `<rect x="${x}" y="${y}" width="4" height="4" fill="${NB.accent}"/>` +
    `<g class="aura" fill="${f.color}">${glyphs.join('')}</g>`
  )
}

const meter = (percent: number): string => {
  const cells = 8
  const full = Math.max(0, Math.min(cells, Math.round((percent / 100) * cells)))

  return '█'.repeat(full) + '░'.repeat(cells - full)
}

/** The usage limit, short: "5h limit" / "hạn 5h". */
const limitWords = (lang: Lang, kind: string): string => {
  const k = kind === 'five_hour' ? '5h' : kind === 'seven_day' ? '7d' : kind

  return lang === 'vi' ? `${UI.vi.limit} ${k}` : `${k} ${UI.en.limit}`
}

export function bandSVG(m: BandModel): string {
  const f = FACES[m.state]
  const words = DECISION_WORDS[m.lang]
  const ui = UI[m.lang]
  const [s1, s2] = scrambles(m.state)

  // ---- row 1: face and bubble ----
  // The portrait takes the band's full height on the left; the bubble and meter share row 1, the decisions row 2.
  const tile = { x: 8, y: 4, w: 104, h: BAND_H - 8 }
  const left = tile.x + tile.w + 14
  const faceX = tile.x + tile.w / 2
  const faceY = tile.y + tile.h / 2 + 7
  const bubbleX = left + 8
  const lines = m.line === '' ? [] : wrap(m.line, 380)
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
    strip = `<text x="${left}" y="66" class="mono quiet">${xml(ui.noTask)}</text>`
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
        // M9: the moment the user accepts, the last ✓ flashes signal once.
        const flash = i === 3 && d.accepted && m.state === 'verified' ? ' flash' : ''

        spans.push(`<tspan dx="5" class="ok${flash}">${i === 3 && d.redo ? '↺' : '✓'}</tspan>`)
      } else if (isNext) {
        spans.push(`<tspan dx="3" class="cur">▍</tspan>`)
      }
    }
    strip = `<text x="${left}" y="66" class="mono">${spans.join('')}</text>`
  }

  const ctx = m.contextPercent
  const lim = m.limit
  // The meter sits top right in two quiet lines, so the decisions keep row 2 to themselves.
  const meterSvg =
    ctx === null
      ? ''
      : `<text x="${BAND_W - 12}" y="20" text-anchor="end" class="mono quiet">${xml(`${ui.context} ${meter(ctx)} ${Math.round(ctx)}%`)}</text>` +
        (lim === null
          ? ''
          : `<text x="${BAND_W - 12}" y="36" text-anchor="end" class="mono quiet">${xml(`${limitWords(m.lang, lim.kind)} ${Math.round(lim.percentUsed)}%`)}</text>`)

  const css =
    `.mono{font:600 11.5px ${MONO}}.say{font:400 13px ${SANS};fill:${NB.fg}}` +
    `.face{font:600 23px ${MONO};text-anchor:middle}.tail{font:600 18px ${MONO}}.aura text{font:400 8px ${MONO}}.aura{animation:aura .6s ease-out 1 both}@keyframes aura{from{opacity:0}to{opacity:1}}` +
    `.done{fill:${NB.fgMuted}}.ok{fill:${NB.signal};font-weight:700}.next{fill:${NB.fg}}.cur{fill:${NB.accent};animation:blink 1.1s steps(1,end) 3}` +
    `.later,.quiet{fill:${NB.fgSubtle}}.stale{opacity:.62}` +
    `.flash{animation:flash .9s ease-out 1 both}@keyframes flash{0%{fill:${NB.fg}}20%{fill:${NB.signal};font-size:15px}100%{fill:${NB.signal}}}` +
    `.sc{opacity:0}.sc0{animation:sc0 .35s steps(1,end) 1 both}.sc1{animation:sc1 .35s steps(1,end) 1 both}` +
    `.real{animation:real .35s steps(1,end) 1 both}` +
    `.pulse{animation:pulse 1.4s ease-in-out 3 alternate both}` +
    `@keyframes sc0{0%{opacity:1}33%{opacity:0}}@keyframes sc1{0%{opacity:0}33%{opacity:1}66%{opacity:0}}` +
    `@keyframes real{0%{opacity:0}66%{opacity:1}100%{opacity:1}}@keyframes blink{50%{opacity:0}}@keyframes pulse{from{fill-opacity:.45}to{fill-opacity:1}}` +
    `@media (prefers-reduced-motion:reduce){.sc0,.sc1{animation:none;opacity:0}.real,.cur,.pulse,.flash,.aura{animation:none;opacity:1;fill-opacity:1}}`

  const tailCls = m.state === 'working' || m.state === 'thinking' ? 'tail pulse' : 'tail'
  const alt = `${m.lang === 'vi' ? 'Đồng nghiệp' : 'Colleague'}: ${STATE_WORDS[m.lang][m.state]}`

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${BAND_W}" height="${BAND_H}" viewBox="0 0 ${BAND_W} ${BAND_H}" role="img" class="nbb" aria-label="${xml(alt)}">` +
    `<style>${scopeCSS(css, 'nbb')}</style>` +
    `<rect width="${BAND_W}" height="${BAND_H}" fill="${NB.bg}" fill-opacity=".86"/>` +
    portrait(m.state, tile.x, tile.y, tile.w, tile.h) +
    `<text x="${faceX}" y="${faceY}" class="face sc sc0" fill="${f.color}">${xml(s1)}</text>` +
    `<text x="${faceX}" y="${faceY}" class="face sc sc1" fill="${f.color}">${xml(s2)}</text>` +
    `<g class="real"><text x="${faceX}" y="${faceY}" class="face" fill="${f.color}">${xml(f.face)}` +
    (f.tail === '' ? '' : `<tspan dx="2" class="${tailCls}">${xml(f.tail)}</tspan>`) +
    `</text></g>` +
    bubble +
    `<line x1="${left}" x2="${BAND_W - 12}" y1="47.5" y2="47.5" stroke="${NB.line}" stroke-dasharray="2 4"/>` +
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
