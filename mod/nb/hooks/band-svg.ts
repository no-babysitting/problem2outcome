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
export const BAND_H = 88

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

/** Calm until it matters: muted, then warn from 70%, danger from 90%. */
const levelColor = (percent: number): string => (percent >= 90 ? NB.danger : percent >= 70 ? NB.warn : NB.fgMuted)

/** The usage limit, short: "5h limit" / "hạn 5h". */
const limitWords = (lang: Lang, kind: string): string => {
  const k = kind === 'five_hour' ? '5h' : kind === 'seven_day' ? '7d' : kind

  return lang === 'vi' ? `${UI.vi.limit} ${k}` : `${k} ${UI.en.limit}`
}

/** The state in one or two words, for the filled tag. */
const STATE_TAG: Record<Lang, Record<ColleagueState, string>> = {
  en: { idle: 'Waiting', thinking: 'Reading', working: 'Working', asking: 'Asking', overloaded: 'Busy', verified: 'Accepted' },
  vi: { idle: 'Chờ bạn', thinking: 'Đang đọc', working: 'Đang làm', asking: 'Đang hỏi', overloaded: 'Nhiều việc', verified: 'Đã nhận' },
}

// Labels are monospace capitals with a little tracking; one advance is about 0.6 em plus the tracking.
const LABEL_PX = 10.5
const TRACK_PX = 0.9
const labelWidth = (s: string): number => [...s].length * (LABEL_PX * 0.6 + TRACK_PX)
const upper = (s: string): string => s.toLocaleUpperCase('vi')

/** A tag: filled (the state) or outlined (the progress), joined edge to edge as a pair. */
const tag = (x: number, y: number, text: string, filled: boolean, fill: string): { svg: string; w: number } => {
  const w = Math.ceil(labelWidth(text)) + 14

  return {
    w,
    svg:
      (filled
        ? `<rect x="${x}" y="${y}" width="${w}" height="17" fill="${fill}"/>`
        : `<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="16" fill="none" stroke="${NB.line}"/>`) +
      `<text x="${x + 7}" y="${y + 12.2}" class="lab" fill="${filled ? NB.bgSunken : NB.fgMuted}">${xml(text)}</text>`,
  }
}

/** The Colleague's tile: a solid square in the state's colour, the face cut out of it in the page's dark. */
const tileSVG = (state: ColleagueState, x: number, y: number, w: number, h: number): string => {
  const f = FACES[state]
  const inner = portrait(state, x, y, w, h)
  // Reuse the aura's glyph placement, drawn dark on the colour instead of coloured on the dark.
  const aura = /<g class="aura"[^>]*>([\s\S]*)<\/g>$/.exec(inner)?.[1] ?? ''

  // Waiting is quiet: an outlined tile and a muted face. Every other state fills the tile with its colour.
  if (state === 'idle') {
    return (
      `<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" fill="${NB.bgSunken}" stroke="${NB.line}"/>` +
      `<g class="aura" fill="${f.color}" fill-opacity=".5">${aura}</g>`
    )
  }

  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f.color}" class="tile"/>` +
    `<g class="aura" fill="${NB.bgSunken}" fill-opacity=".38">${aura}</g>`
  )
}

/** Eight small + leave the face once when the user accepts (verified): order, not confetti. */
const burst = (cx: number, cy: number): string =>
  [0, 1, 2, 3, 4, 5, 6, 7]
    .map(k => {
      const a = (k / 8) * Math.PI * 2 + 0.3
      const dx = (Math.cos(a) * 34).toFixed(1)
      const dy = (Math.sin(a) * 22).toFixed(1)

      return `<text x="${cx}" y="${cy}" class="spark" style="--dx:${dx}px;--dy:${dy}px">+</text>`
    })
    .join('')

/**
 * The decisions as a row of tabs, like a site's section nav: "[1] VẤN ĐỀ". The key shows the state: a number while
 * open, ✓ made (signal), ↺ redo (warn), – skipped. Your turn is the bright tab, underlined in accent, with the cursor
 * blinking three times (DS M7).
 */
const tabs = (m: BandModel, left: number, y: number): string => {
  const d = m.decisions
  const words = DECISION_WORDS[m.lang]

  if (d === null) {
    return `<text x="${left}" y="${y}" class="lab" fill="${NB.fgSubtle}">${xml(upper(UI[m.lang].noTask))}</text>`
  }
  const out: string[] = []
  let x = left

  for (let i = 0; i < 4; i++) {
    if (!d.applies[i]) {
      continue
    }
    const made = d.made[i]
    const redo = i === 3 && d.redo
    const isNext = d.next === i + 1
    const key = made ? (redo ? '↺' : '✓') : d.skipped[i] ? '–' : String(i + 1)
    const keyColor = made ? (redo ? NB.warn : NB.signal) : isNext ? NB.accent : NB.control
    const label = upper(words[i] ?? '')
    const labelColor = isNext ? NB.fg : made ? NB.fgMuted : NB.fgSubtle
    const keyW = labelWidth(`[${key}] `)
    const flash = i === 3 && d.accepted && m.state === 'verified' ? ' flash' : ''

    out.push(
      `<text x="${x.toFixed(1)}" y="${y}" class="lab"><tspan fill="${NB.control}">[</tspan><tspan fill="${keyColor}" class="key${flash}">${key}</tspan><tspan fill="${NB.control}">]</tspan></text>`,
    )
    out.push(`<text x="${(x + keyW).toFixed(1)}" y="${y}" class="lab${isNext ? ' on' : ''}" fill="${labelColor}">${xml(label)}</text>`)
    if (isNext) {
      const lw = labelWidth(label)

      out.push(`<rect x="${(x + keyW).toFixed(1)}" y="${y + 5}" width="${lw.toFixed(1)}" height="2" fill="${NB.accent}" class="uline"/>`)
      out.push(`<rect x="${(x + keyW + lw + 3).toFixed(1)}" y="${y - 8}" width="5" height="10" fill="${NB.accent}" class="cur"/>`)
    }
    x += keyW + labelWidth(label) + 26
  }

  return out.join('')
}

export function bandSVG(m: BandModel): string {
  const f = FACES[m.state]
  const ui = UI[m.lang]
  const [s1, s2] = scrambles(m.state)
  const H = BAND_H
  const tile = { x: 8, y: 6, w: 96, h: H - 12 }
  const left = tile.x + tile.w + 18
  const right = BAND_W - 12
  const faceX = tile.x + tile.w / 2
  const faceY = tile.y + tile.h / 2 + 7

  // ---- row 1: the tag pair, then The Colleague's sentence; the meta on the right ----
  const d = m.decisions
  const t1 = tag(left, 6, upper(STATE_TAG[m.lang][m.state]), true, f.color)
  const applies = d === null ? 0 : d.applies.filter(Boolean).length
  const made = d === null ? 0 : d.applies.filter((a, i) => a && d.made[i]).length
  const t2 = d === null ? { svg: '', w: 0 } : tag(left + t1.w, 6, `${made}/${applies}`, false, '')
  // Wrapped at 420 px, under the 470 px clip: Be Vietnam Pro runs a few percent wider than the fallback fonts.
  const lines = m.line === '' ? [] : wrap(m.line, 420)
  // Two lines sit 3 px higher, so descenders on the second line clear the rule at H - 29 (review F9-01).
  const sayY = lines.length > 1 ? 36 : 39
  const say =
    lines.length === 0
      ? ''
      : `<g class="bub${m.isStale ? ' stale' : ''}">` +
        lines
          .map(
            (l, i) =>
              `<clipPath id="nbb-ty${i}"><rect x="${left}" y="${sayY - 15 + i * 16}" width="470" height="20" class="ty ty${i}"/></clipPath>` +
              `<text x="${left}" y="${sayY + i * 16}" class="say" clip-path="url(#nbb-ty${i})">${xml(l)}</text>`,
          )
          .join('') +
        `</g>`

  const ctx = m.contextPercent
  const lim = m.limit
  const meta = (label: string, pct: number, y: number): string =>
    `<text x="${right}" y="${y}" text-anchor="end" class="lab"><tspan fill="${NB.fgSubtle}">${xml(upper(label))}</tspan>` +
    `<tspan dx="8" fill="${levelColor(pct)}" class="num">${Math.round(pct)}%</tspan></text>`
  const metas = (ctx === null ? '' : meta(ui.context, ctx, 18)) + (lim === null ? '' : meta(limitWords(m.lang, lim.kind), lim.percentUsed, 36))

  const blinks = m.state === 'idle' || m.state === 'asking'
  const css =
    `.lab{font:500 ${LABEL_PX}px ${MONO};letter-spacing:${TRACK_PX}px}.num{font-weight:600}.on{font-weight:700}` +
    `.say{font:400 13.5px ${SANS};fill:${NB.fg}}.stale{opacity:.62}` +
    `.face{font:600 21px ${MONO};text-anchor:middle}.tail{font:600 16px ${MONO}}.aura text{font:400 8px ${MONO}}.aura{animation:aura .6s ease-out 1 both}@keyframes aura{from{opacity:0}to{opacity:1}}` +
    `.cur{animation:blink 1.1s steps(1,end) 3}@keyframes blink{50%{opacity:0}}` +
    `.uline{transform-box:fill-box;transform-origin:left;animation:uline .45s cubic-bezier(.2,.7,.2,1) 1 both}@keyframes uline{from{transform:scaleX(0)}}` +
    `.tile{animation:tile .35s steps(1,end) 1 both}@keyframes tile{from{fill:${NB.bgSunken}}}` +
    `.flash{animation:flash .9s ease-out 1 both}@keyframes flash{0%{fill:${NB.fg}}25%{fill:${NB.signal};font-size:14px}100%{fill:${NB.signal}}}` +
    `.bub{animation:bin .28s ease-out 1 both}@keyframes bin{from{opacity:0;transform:translateY(3px)}}` +
    `.ty{animation:ty .55s steps(28,end) .1s 1 both}.ty1{animation:ty .55s steps(28,end) .6s 1 both}@keyframes ty{from{width:0}}` +
    `.sc{opacity:0}.sc0{animation:sc0 .35s steps(1,end) 1 both}.sc1{animation:sc1 .35s steps(1,end) 1 both}` +
    `.real{animation:real .35s steps(1,end) 1 both}` +
    `.pulse{animation:pulse 1.4s ease-in-out 3 alternate both}` +
    `.lid{opacity:0;animation:lid 5.2s linear .8s 1}@keyframes lid{0%,45%,48.5%,86%,89.5%,100%{opacity:0}45.1%,48.4%,86.1%,89.4%{opacity:1}}` +
    `.spark{font:700 10px ${MONO};fill:${NB.bgSunken};text-anchor:middle;opacity:0;animation:spark 1s cubic-bezier(.2,.7,.2,1) .2s 1}` +
    `@keyframes spark{from{opacity:1;transform:translate(0,0)}to{opacity:0;transform:translate(var(--dx),var(--dy))}}` +
    `@keyframes sc0{0%{opacity:1}33%{opacity:0}}@keyframes sc1{0%{opacity:0}33%{opacity:1}66%{opacity:0}}` +
    `@keyframes real{0%{opacity:0}66%{opacity:1}100%{opacity:1}}@keyframes pulse{from{fill-opacity:.45}to{fill-opacity:1}}` +
    `@media (prefers-reduced-motion:reduce){.sc0,.sc1,.spark,.lid{animation:none;opacity:0}` +
    `.real,.cur,.pulse,.aura,.bub,.ty,.ty1,.uline,.tile,.flash{animation:none;opacity:1;fill-opacity:1;transform:none}}`

  const tailCls = m.state === 'working' || m.state === 'thinking' ? 'tail pulse' : 'tail'
  const alt = `${m.lang === 'vi' ? 'Đồng nghiệp' : 'Colleague'}: ${STATE_WORDS[m.lang][m.state]}`
  const lidFace = f.face.replace(/^\[(.)(.)(.)\]$/, '[-$2-]')
  const ink = m.state === 'idle' ? f.color : NB.bgSunken

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${BAND_W}" height="${H}" viewBox="0 0 ${BAND_W} ${H}" role="img" class="nbb" aria-label="${xml(alt)}">` +
    `<style>${scopeCSS(css, 'nbb')}</style>` +
    `<rect width="${BAND_W}" height="${H}" fill="${NB.bg}" fill-opacity=".94"/>` +
    `<rect width="${BAND_W}" height="1" fill="${NB.line}"/>` +
    tileSVG(m.state, tile.x, tile.y, tile.w, tile.h) +
    `<text x="${faceX}" y="${faceY}" class="face sc sc0" fill="${ink}">${xml(s1)}</text>` +
    `<text x="${faceX}" y="${faceY}" class="face sc sc1" fill="${ink}">${xml(s2)}</text>` +
    `<g class="real"><text x="${faceX}" y="${faceY}" class="face" fill="${ink}">${xml(f.face)}` +
    (f.tail === '' ? '' : `<tspan dx="1" class="${tailCls}">${xml(f.tail)}</tspan>`) +
    `</text></g>` +
    (blinks
      ? `<g class="lid"><rect x="${faceX - 36}" y="${faceY - 18}" width="72" height="24" fill="${m.state === 'idle' ? NB.bgSunken : f.color}"/>` +
        `<text x="${faceX}" y="${faceY}" class="face" fill="${ink}">${xml(lidFace)}</text></g>`
      : '') +
    (m.state === 'verified' ? burst(faceX, faceY - 8) : '') +
    t1.svg +
    t2.svg +
    say +
    metas +
    `<rect x="${left}" y="${H - 29}" width="${right - left}" height="1" fill="${NB.line}"/>` +
    tabs(m, left, H - 11) +
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
          .map(i => `${CIRCLED[i]} ${words[i]}${d.made[i] ? ' ✓' : d.skipped[i] ? ' –' : d.next === i + 1 ? ' ▍' : ''}`)
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
