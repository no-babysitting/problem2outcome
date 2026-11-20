// The backdrop: a coloured ASCII scene, returned as one SVG string (no script, CSS motion only).
//
// A lake at first light, built procedurally (ported from NoBabysitting.sources.dawn on the NB website, no stock
// image): sky, a sun with its glow, three ridges, a lake with a sun path. Each glyph takes the scene's colour
// (Asciify's "characters, source color"); glyph density follows brightness and uses the brand's own letters.
// Light motion only: the lake ripples (3 frames), a few stars twinkle. prefers-reduced-motion: still.
//
// The scene tells the task's story: the sun rises as the user makes their decisions (night -> dusk -> dawn),
// the website's M11 "from noise to order" told with light. The subject sits right and high, away from the
// middle (the chat) and the foot (the message box).

type RGB = [number, number, number]
type Mood = { sky: [number, RGB][]; sun: RGB; cloud: RGB; ridges: [RGB, RGB, RGB]; water: [RGB, RGB]; sunUp?: number; sunR?: number }

// Ký hiệu, không chữ cái: màu mang hình, nét chữ chỉ mang mật độ (như ảnh tham chiếu của taisei).
const RAMP = ' ·.:-=+*#%@'
// Mặt hồ dùng nét ngang để đọc ra là nước.
const WATER = ' .·-~=≈≡'

const hash = (x: number, y: number, s: number): number => {
  let n = (Math.round(x * 1000) * 374761393 + Math.round(y * 1000) * 668265263 + s * 1442695041) | 0
  n = Math.imul(n ^ (n >>> 13), 1274126177)
  n ^= n >>> 16

  return (n >>> 0) / 4294967295
}

const vnoise = (x: number, y: number, s: number): number => {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  const a = hash(xi, yi, s)
  const b = hash(xi + 1, yi, s)
  const c = hash(xi, yi + 1, s)
  const d = hash(xi + 1, yi + 1, s)

  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}

const fbm = (x: number, y: number, s: number): number => 0.55 * vnoise(x, y, s) + 0.3 * vnoise(x * 2.1, y * 2.1, s + 3) + 0.15 * vnoise(x * 4.3, y * 4.3, s + 7)
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const ss = (a: number, b: number, x: number): number => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))

  return t * t * (3 - 2 * t)
}
const ramp = (stops: [number, RGB][], t: number): RGB => {
  for (let i = 1; i < stops.length; i++) {
    const a = stops[i - 1]!
    const b = stops[i]!

    if (t <= b[0]) {
      return mix(a[1], b[1], (t - a[0]) / (b[0] - a[0]))
    }
  }

  return stops[stops.length - 1]![1]
}

/** Bảng màu theo giờ trong ngày. Mặc định "dusk" là hoàng hôn tím cam của website. */
export const MOODS: Record<'dusk' | 'dawn' | 'night', Mood> = {
  dusk: {
    sky: [[0, [14, 16, 52]], [0.45, [58, 38, 104]], [0.78, [178, 72, 104]], [1, [246, 160, 88]]],
    sun: [255, 190, 120],
    cloud: [214, 110, 130],
    ridges: [[120, 70, 136], [82, 48, 110], [46, 30, 78]],
    water: [[46, 30, 74], [10, 9, 20]],
  },
  dawn: {
    sky: [[0, [20, 30, 58]], [0.5, [70, 90, 130]], [0.82, [214, 150, 120]], [1, [250, 206, 150]]],
    sun: [255, 222, 170],
    cloud: [236, 170, 160],
    ridges: [[120, 122, 150], [80, 84, 114], [44, 48, 74]],
    water: [[54, 64, 92], [12, 14, 24]],
  },
  night: {
    sky: [[0, [6, 8, 20]], [0.6, [18, 24, 54]], [1, [52, 48, 96]]],
    sun: [220, 226, 255],
    cloud: [90, 96, 150],
    ridges: [[64, 64, 104], [42, 42, 76], [24, 24, 46]],
    water: [[22, 22, 44], [6, 6, 12]],
  },
}

/** Màu của cảnh tại (u, v), 0..1. `phase` chỉ đổi mặt hồ, để làm các khung gợn sóng. */
export const shade = (u: number, v: number, asp: number, m: Mood, phase: number) => {
  const hz = 0.64
  const sx = 0.8
  const sy = hz - (m.sunUp ?? 0.19)
  const dx = (u - sx) * asp
  const dy = v - sy
  const dist = Math.sqrt(dx * dx + dy * dy)
  let c: RGB
  let lit = 1
  let isSun = false

  if (v < hz) {
    c = ramp(m.sky, v / hz)
    c = mix(c, mix([0, 0, 0], c, 0.75), fbm(u * 2.4 + 4, v * 6, 4))
    const glow = Math.max(0, 1 - dist / 0.55)

    c = mix(c, m.sun, glow * glow * glow * 0.55)
    // Chữ dày chỉ quanh mặt trời; phần trời còn lại là dấu nhẹ, để mắt có một tâm điểm.
    lit = (0.6 + 0.3 * glow * glow * glow) * (0.55 + 0.45 * ss(0.1, 0.85, v / hz))
    // Mây kéo ngang, mặt dưới bắt nắng: phá các hàng chữ đều nhau thành kết cấu.
    const band = ss(0.15, 0.4, v / hz) * (1 - ss(0.75, 0.95, v / hz))
    const cloud = ss(0.5, 0.72, fbm(u * 2.6 + 11, v * 16, 31)) * band

    if (cloud > 0) {
      c = mix(c, mix(m.cloud ?? m.sun, m.sun, glow), cloud * 0.75)
    }
    const R = m.sunR ?? 0.085

    if (dist < R) {
      c = mix([255, 248, 230], m.sun, ss(R * 0.35, R, dist) * 0.85)
      isSun = true
    } else if (dist < 0.26) {
      isSun = true
    }
    // Ba lớp núi, xa nhạt gần đậm. Đỉnh núi xa thấp hơn mặt trời để mặt trời ló lên.
    for (let k = 0; k < m.ridges.length; k++) {
      // Núi xa cao và mềm, núi gần thấp và gắt; mặt trời nằm trong một thung lũng của dãy xa.
      const base = hz - 0.04 * (m.ridges.length - 1 - k)
      const amp = [0.26, 0.16, 0.08][k] ?? 0.08
      // Thung lũng quanh mặt trời, núi cao dần về mép trái để đóng khung cảnh.
      const valley = (0.25 + 0.75 * ss(0.05, 0.3, Math.abs(u - sx))) * (0.7 + 0.5 * (1 - u))
      const ridge = base - 0.01 - ss(0.3, 0.66, fbm(u * (1.8 + k * 2.2) + k * 5, 1 + k, 4 + k)) * amp * valley

      if (v > ridge) {
        // Viền sáng chỉ gần mặt trời; xa mặt trời núi là khối tối, yên.
        const near = Math.max(0, 1 - dist / 0.7)
        const rim = v - ridge < 0.026 ? (1 - k * 0.35) * near : 0
        c = mix(m.ridges[k]!, m.sun, Math.max(0, rim * 0.45 + glow * glow * (0.25 - k * 0.08)))
        lit = ([0.5, 0.38, 0.28][k] ?? 0.28) + rim * 0.9
        isSun = false
      }
    }
  } else {
    const tw = (v - hz) / (1 - hz)

    c = mix(m.water[0], m.water[1], ss(0, 1, tw))
    lit = 0.8
    const wdt = 0.02 + tw * 0.1
    const streak = fbm(u * 22 + phase * 0.9, v * 70 + phase * 0.35, 9)

    if (Math.abs(u - sx) < wdt * (0.4 + streak) && streak > 0.47) {
      c = mix(m.sun, m.ridges[0], tw * 0.7)
      lit = 1.1 - tw * 0.4
    } else if (fbm(u * 12 + phase * 0.6, v * 60, 12) > 0.66) {
      c = mix(c, m.ridges[0], 0.7)
      lit = 0.9
    }
  }

  return { c, lit, isWater: v >= hz, isSun }
}

const STOPS = [0, 0.3, 0.55, 0.8, 1]
const blend = (a: Mood, b: Mood, k: number): Mood => ({
  sky: STOPS.map(t => [t, mix(ramp(a.sky, t), ramp(b.sky, t), k)] as [number, RGB]),
  sun: mix(a.sun, b.sun, k),
  cloud: mix(a.cloud, b.cloud, k),
  ridges: [mix(a.ridges[0], b.ridges[0], k), mix(a.ridges[1], b.ridges[1], k), mix(a.ridges[2], b.ridges[2], k)],
  water: [mix(a.water[0], b.water[0], k), mix(a.water[1], b.water[1], k)],
})

/**
 * Cảnh theo số quyết định đã chốt (0..1): đêm có trăng thấp, rồi hoàng hôn tím, rồi rạng sáng,
 * mặt trời lên cao dần. Đây là "từ nhiễu đến trật tự" của M11, kể bằng ánh sáng.
 */
export function moodFor(progress: number): Mood {
  const p = Math.max(0, Math.min(1, progress))
  const m = p < 0.5 ? blend(MOODS.night, MOODS.dusk, ss(0, 0.5, p)) : blend(MOODS.dusk, MOODS.dawn, ss(0.5, 1, p))

  return { ...m, sunUp: 0.13 + 0.12 * p, sunR: 0.05 + 0.035 * ss(0, 0.6, p) }
}

type Cell = { ch: string; cl: string; isWater: boolean; isSun: boolean }

export function asciiSceneSVG(o: { cols?: number; rows?: number; mood?: keyof typeof MOODS; progress?: number; minLum?: number } = {}): string {
  const cols = o.cols ?? 140
  const rows = o.rows ?? 44
  const m = o.progress != null ? moodFor(o.progress) : (MOODS[o.mood ?? 'dusk'] ?? MOODS.dusk)
  const minLum = o.minLum ?? 0.34
  const asp = (cols * 0.6) / (rows * 1.25)
  const palette = new Map<string, string>()

  // Màu được làm tròn để gộp ô liền nhau thành một đoạn, giữ SVG nhỏ.
  const cls = (rgb: RGB): string => {
    const q = rgb.map(n => Math.max(0, Math.min(255, Math.round(n / 20) * 20)))
    const key = q.join(',')

    if (!palette.has(key)) {
      palette.set(key, `c${palette.size.toString(36)}`)
    }

    return palette.get(key) as string
  }

  const cell = (x: number, y: number, phase: number): Cell => {
    const u = (x + 0.5) / cols
    const v = (y + 0.5) / rows
    const s = shade(u, v, asp, m, phase)
    let [r, g, b] = s.c
    const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    // Mật độ theo độ sáng (tối thì để trống, nền thở được); hạt nhiễu nhỏ cho kết cấu, không làm rối hình.
    const d = Math.pow(l, 1.9) * s.lit * 2.1 + (hash(x, y, 21) - 0.5) * 0.08
    const set = s.isWater ? WATER : RAMP
    const k = Math.round(Math.max(0, Math.min(1, (d - 0.08) / 0.82)) * (set.length - 1))

    if (k === 0) {
      return { ch: ' ', cl: '', isWater: s.isWater, isSun: s.isSun }
    }
    if (l < minLum && l > 0) {
      const f = minLum / l

      r = Math.min(255, r * f)
      g = Math.min(255, g * f)
      b = Math.min(255, b * f)
    }

    return { ch: set[k] ?? ' ', cl: cls([r, g, b]), isWater: s.isWater, isSun: s.isSun }
  }

  const esc = (c: string): string => (c === '<' ? '&lt;' : c === '&' ? '&amp;' : c)
  const line = (cells: Cell[]): string => {
    let out = ''
    let run = ''
    let cur = ''

    for (const { ch, cl } of cells) {
      // Ô trống đi theo đoạn đang mở, để không cắt đoạn màu vô ích.
      if (ch !== ' ' && cl !== cur) {
        if (run !== '') {
          out += cur === '' ? run : `<tspan class="${cur}">${run}</tspan>`
        }
        run = ''
        cur = cl
      }
      run += esc(ch)
    }
    if (run !== '') {
      out += cur === '' ? run : `<tspan class="${cur}">${run}</tspan>`
    }

    return out
  }

  const LH = 16
  const still: string[] = []
  const waves: string[][] = [[], [], []]
  const sun: string[] = []
  let firstWater = rows

  for (let y = 0; y < rows; y++) {
    const cells: Cell[] = []

    for (let x = 0; x < cols; x++) {
      cells.push(cell(x, y, 0))
    }
    const isWaterRow = cells[0]?.isWater === true

    if (isWaterRow) {
      firstWater = Math.min(firstWater, y)
      for (let f = 0; f < 3; f++) {
        const fc = f === 0 ? cells : cells.map((_, x) => cell(x, y, f * 1.3))

        waves[f]!.push(`<text y="${(y + 1) * LH}">${line(fc)}</text>`)
      }
    } else {
      // Quầng nắng nằm trên lớp riêng để "thở"; phần còn lại của hàng đứng yên.
      const skyCells = cells.map(c => (c.isSun ? { ...c, ch: ' ', cl: '' } : c))
      const sunCells = cells.map(c => (c.isSun ? c : { ...c, ch: ' ', cl: '' }))

      still.push(`<text y="${(y + 1) * LH}">${line(skyCells)}</text>`)
      if (cells.some(c => c.isSun)) {
        sun.push(`<text y="${(y + 1) * LH}">${line(sunCells)}</text>`)
      }
    }
  }

  // Vài sao nhấp nháy ở nửa trên.
  const stars: string[] = []

  for (let i = 0; i < 14; i++) {
    const x = Math.floor(hash(i, 3, 77) * cols)
    const y = Math.floor(hash(i, 5, 78) * rows * 0.3)

    stars.push(`<text class="st s${i % 3}" x="${(x * 7.8).toFixed(1)}" y="${(y + 1) * LH}">+</text>`)
  }

  const css = [...palette].map(([rgb, name]) => `.${name}{fill:rgb(${rgb})}`).join('')
  const W = Math.round(cols * 7.8)
  const H = rows * LH + 4
  const motion =
    '.w{opacity:0;animation:w 3.6s steps(1,end) infinite}.w0{opacity:1}.w1{animation-delay:-1.2s}.w2{animation-delay:-2.4s}' +
    '@keyframes w{0%{opacity:1}33.4%{opacity:0}}' +
    '.sun{animation:b 7s ease-in-out infinite alternate}@keyframes b{from{opacity:.82}to{opacity:1}}' +
    '.st{fill:#f4ecff;opacity:.25;animation:t 5s ease-in-out infinite alternate}.s1{animation-delay:-1.7s}.s2{animation-delay:-3.3s}@keyframes t{to{opacity:.85}}' +
    '@media (prefers-reduced-motion:reduce){.w,.sun,.st{animation:none!important}.w1,.w2{opacity:0}}'

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">` +
    `<style>text{font:13px "JetBrains Mono",ui-monospace,Menlo,Consolas,monospace;white-space:pre}${css}${motion}</style>` +
    `<rect width="${W}" height="${H}" fill="#0f0d0b"/>` +
    `<g>${still.join('')}</g><g class="sun">${sun.join('')}</g>` +
    waves.map((rowsF, f) => `<g class="w w${f}">${rowsF.join('')}</g>`).join('') +
    `<g>${stars.join('')}</g></svg>`
  )
}
