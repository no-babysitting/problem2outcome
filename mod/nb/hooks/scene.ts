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

import { scopeCSS } from './scope.js'

type RGB = [number, number, number]
type Mood = { sky: [number, RGB][]; sun: RGB; cloud: RGB; ridges: [RGB, RGB, RGB]; water: [RGB, RGB]; sunUp?: number; sunR?: number; rays?: number }

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

const HZ = 0.64
const SX = 0.8
/** Đỉnh núi lớp k tại u (0 = xa nhất). Núi xa cao và mềm, núi gần thấp và gắt; mặt trời nằm trong thung lũng của dãy xa. */
const ridgeAt = (k: number, u: number, n: number): number => {
  const base = HZ - 0.04 * (n - 1 - k)
  const amp = [0.26, 0.16, 0.08][k] ?? 0.08
  // Núi cao dần về mép trái để đóng khung cảnh.
  const valley = (0.25 + 0.75 * ss(0.05, 0.3, Math.abs(u - SX))) * (0.7 + 0.5 * (1 - u))

  return base - 0.01 - ss(0.3, 0.66, fbm(u * (1.8 + k * 2.2) + k * 5, 1 + k, 4 + k)) * amp * valley
}

/** Màu của cảnh tại (u, v), 0..1. `phase` chỉ đổi mặt hồ, để làm các khung gợn sóng. */
export const shade = (u: number, v: number, asp: number, m: Mood, phase: number, cell?: { du: number; dv: number }) => {
  const hz = HZ
  const sx = SX
  const sy = hz - (m.sunUp ?? 0.19)
  const dx = (u - sx) * asp
  const dy = v - sy
  const dist = Math.sqrt(dx * dx + dy * dy)
  let c: RGB
  let lit = 1
  let isSun = false
  // Nét viền núi theo độ dốc (/ \\ _ -), và tia nắng: ký hiệu đặt tay, cho cảnh có đường nét chứ không chỉ mật độ.
  let edge = ''
  // 1 ở tâm mặt trời, 0 ở mép đĩa, -1 ngoài đĩa: đĩa được tô theo bán kính, không phải một khối @ phẳng.
  let core = -1

  if (v < hz) {
    c = ramp(m.sky, v / hz)
    c = mix(c, mix([0, 0, 0], c, 0.75), fbm(u * 2.4 + 4, v * 6, 4))
    const glow = Math.max(0, 1 - dist / 0.55)

    c = mix(c, m.sun, glow * glow * glow * 0.55)
    // Chữ dày chỉ quanh mặt trời; phần trời còn lại là dấu nhẹ, để mắt có một tâm điểm.
    lit = (0.6 + 0.3 * glow * glow * glow) * (0.55 + 0.45 * ss(0.1, 0.85, v / hz))
    // Xa mặt trời theo chiều ngang thì trời thưa dần: mép trái là khoảng thở, không phải một bức tường dấu hai chấm.
    lit *= 0.62 + 0.38 * ss(0.15, 0.75, 1 - Math.abs(u - sx))
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
      core = 1 - dist / R
    } else if (dist < R * 1.35) {
      // Một vành tối mỏng tách đĩa khỏi quầng sáng, để mắt đọc ra hình tròn.
      lit *= 0.3
      isSun = true
    } else if (dist < 0.26) {
      isSun = true
    }
    // Ba lớp núi, xa nhạt gần đậm. Đỉnh núi xa thấp hơn mặt trời để mặt trời ló lên.
    // Tia nắng ngắn quanh mặt trời, dài dần theo số quyết định (rays = 0 thì không có).
    const rays = m.rays ?? 0

    if (cell && rays > 0 && dist > R * 1.5 && dist < R * (1.5 + 1.3 * rays)) {
      const a = Math.atan2(dy, dx)
      const step = Math.PI / 4
      const idx = Math.round(a / step)
      const off = Math.abs(a - idx * step) * dist

      // Tia mảnh và đứt quãng (cách một ô), như nét vẽ tay trong ảnh tham chiếu.
      if (off < Math.min(cell.dv, cell.du * asp) * 0.5 && Math.round(dist / cell.dv) % 2 === 0) {
        edge = ['-', '\\', '|', '/'][((idx % 4) + 4) % 4] ?? '-'
        c = mix(m.sun, c, ss(R * 1.5, R * (1.5 + 1.3 * rays), dist) * 0.7)
        lit = 1
      }
    }
    for (let k = 0; k < m.ridges.length; k++) {
      const ridge = ridgeAt(k, u, m.ridges.length)

      if (v > ridge) {
        // Viền sáng chỉ gần mặt trời; xa mặt trời núi là khối tối, yên.
        const near = Math.max(0, 1 - dist / 0.7)
        const rim = v - ridge < 0.026 ? (1 - k * 0.35) * near : 0
        c = mix(m.ridges[k]!, m.sun, Math.max(0, rim * 0.45 + glow * glow * (0.25 - k * 0.08)))
        // Thân núi có vân (sườn đón nắng sáng hơn, sâu xuống thì tối dần), không phải một mảng ký tự đều.
        const grain = 0.7 + 0.6 * fbm(u * (7 + k * 4) + k * 3, v * 12, 7 + k)
        const depth = 1 - 0.4 * ss(0, 0.16, v - ridge)
        lit = (([0.5, 0.38, 0.28][k] ?? 0.28) * grain * depth) + rim * 0.9
        isSun = false
        edge = ''
        core = -1
        if (cell && v - cell.dv <= ridge) {
          // Ô chứa đường đỉnh núi: chọn nét theo độ dốc tính bằng ô.
          const slope = ((ridgeAt(k, u + cell.du, m.ridges.length) - ridgeAt(k, u - cell.du, m.ridges.length)) / 2 / cell.dv)
          // Dốc thì / \\ hay |; thoải thì chọn _ - ‾ theo chỗ đường đỉnh cắt qua ô, để nét liền mạch.
          const pos = (ridge - (v - cell.dv / 2)) / cell.dv
          edge = slope < -2.2 || slope > 2.2 ? '|' : slope < -0.6 ? '/' : slope > 0.6 ? '\\' : pos < -0.2 ? '‾' : pos > 0.2 ? '_' : '-'
          c = mix(mix(m.ridges[k]!, [236, 226, 214], 0.35 - k * 0.08), m.sun, 0.25 + 0.6 * near)
        }
      }
    }
  } else {
    const tw = (v - hz) / (1 - hz)

    c = mix(m.water[0], m.water[1], ss(0, 1, tw))
    lit = 0.7
    // Bóng phản chiếu: lật trời và núi qua đường chân trời, gợn ngang theo pha; xa bờ thì nhạt dần.
    const wob = (fbm(u * 3 + phase * 0.5, v * 40, 17) - 0.5) * (0.012 + tw * 0.05)
    const mv = hz - (v - hz) * 1.35
    if (mv > 0) {
      const r = shade(u + wob, mv, asp, m, phase)
      const k = 0.62 * (1 - tw * 0.7)

      c = mix(c, mix([0, 0, 0], r.c, 0.62), k)
      lit = 0.55 + r.lit * 0.35 * (1 - tw * 0.5)
    }
    const wdt = 0.02 + tw * 0.1
    const streak = fbm(u * 22 + phase * 0.9, v * 70 + phase * 0.35, 9)

    if (Math.abs(u - sx) < wdt * (0.4 + streak) && streak > 0.47) {
      c = mix(m.sun, m.ridges[0], tw * 0.7)
      lit = 1.1 - tw * 0.4
    } else if (fbm(u * 12 + phase * 0.6, v * 60, 12) > 0.7) {
      c = mix(c, m.sun, 0.25)
      lit += 0.15
    }
  }

  return { c, lit, isWater: v >= hz, isSun, edge, core }
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

  return { ...m, sunUp: 0.13 + 0.14 * p, sunR: 0.05 + 0.035 * ss(0, 0.6, p), rays: ss(0.4, 1, p) }
}

// M11 (từ nhiễu đến trật tự): mỗi ô có một ngưỡng; "order" vượt ngưỡng thì ô hiện hình thật, chưa thì là nhiễu.
// Ngưỡng ngẫu nhiên có thiên hướng (sweep) như renderer của website; ở đây hướng là từ mặt trời ra xa.
const NOISE = '/\\|<>{}[]~^!?;:'
const SWEEP = 0.62
const NOISE_FILL = 0.26
/** Bao nhiêu phần bức tranh đã thành hình, theo số quyết định đã chốt. Chưa quyết gì vẫn thấy được chân trời. */
export const orderFor = (progress: number): number => 0.34 + 0.66 * Math.max(0, Math.min(1, progress))

type Cell = { ch: string; cl: string; isWater: boolean; t: number; noise: string; zone: 0 | 1 | 2 }

export function asciiSceneSVG(
  o: { cols?: number; rows?: number; mood?: keyof typeof MOODS; progress?: number; from?: number | null; minLum?: number; calm?: boolean } = {},
): string {
  const cols = o.cols ?? 140
  const rows = o.rows ?? 44
  const m = o.progress != null ? moodFor(o.progress) : (MOODS[o.mood ?? 'dusk'] ?? MOODS.dusk)
  const minLum = o.minLum ?? 0.34
  const asp = (cols * 0.6) / (rows * 1.25)
  const pTo = o.progress != null ? orderFor(o.progress) : 1
  // Chỉ hội tụ khi tiến lên; lùi lại (làm lại) thì vẽ thẳng trạng thái mới.
  const pFrom = o.from != null && o.progress != null ? Math.min(pTo, orderFor(o.from)) : pTo
  const calm = o.calm ?? true
  const palette = new Map<string, string>()

  const cls = (rgb: RGB): string => {
    const q = rgb.map(n => Math.max(0, Math.min(255, Math.round(n / 20) * 20)))
    const key = q.join(',')

    if (!palette.has(key)) {
      palette.set(key, `c${palette.size.toString(36)}`)
    }

    return palette.get(key) as string
  }

  // Vùng yên: cột giữa là chỗ khung chat; không có nhiễu ở đó, và hình mờ đi để chữ luôn đọc rõ (calm của website).
  const zoneOf = (x: number): 0 | 1 | 2 => {
    if (!calm) {
      return 2
    }
    const u = (x + 0.5) / cols

    return u > 0.3 && u < 0.7 ? 0 : u > 0.25 && u < 0.75 ? 1 : 2
  }

  const cell = (x: number, y: number, phase: number): Cell => {
    const u = (x + 0.5) / cols
    const v = (y + 0.5) / rows
    const s = shade(u, v, asp, m, phase, { du: 1 / cols, dv: 1 / rows })
    const zone = zoneOf(x)
    let [r, g, b] = s.c
    const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    const calmK = zone === 0 ? 0.55 : zone === 1 ? 0.8 : 1
    const d = Math.pow(l, 1.9) * s.lit * 2.1 * calmK + (hash(x, y, 21) - 0.5) * 0.08
    const set = s.isWater ? WATER : RAMP
    const k =
      s.core >= 0
        ? Math.round((0.7 + 0.3 * ss(0, 0.7, s.core)) * (set.length - 1))
        : Math.round(Math.max(0, Math.min(1, (d - 0.08) / 0.82)) * (set.length - 1))
    // Trật tự lan ra từ mặt trời: chưa quyết gì vẫn thấy vầng sáng; mỗi quyết định mở rộng vùng đã rõ.
    const fromSun = Math.min(1, Math.hypot((u - SX) * asp, (v - HZ + (m.sunUp ?? 0.19)) * 1.2) / 1.25)
    const t = Math.min(0.999, hash(x, y, 41) * (1 - SWEEP) + fromSun * SWEEP)
    const noise = NOISE.charAt(Math.floor(hash(x, y, 43) * NOISE.length))

    if (k === 0 && s.edge === '') {
      return { ch: ' ', cl: '', isWater: s.isWater, t, noise, zone }
    }
    if (l < minLum && l > 0) {
      const f = minLum / l

      r = Math.min(255, r * f)
      g = Math.min(255, g * f)
      b = Math.min(255, b * f)
    }
    if (zone !== 2) {
      ;[r, g, b] = mix([20, 18, 15], [r, g, b], calmK)
    }

    return { ch: s.edge !== '' ? s.edge : (set[k] ?? ' '), cl: cls([r, g, b]), isWater: s.isWater, t, noise, zone }
  }

  // Nhiễu chỉ phủ một phần ô, thưa hơn ở viền vùng yên, không có trong vùng yên.
  // Nhiễu cũng thưa dần về phía dưới, để ô nhập luôn yên.
  const hasNoise = (c: Cell, x: number, y: number): boolean =>
    c.zone !== 0 && hash(x, y, 47) < NOISE_FILL * (c.zone === 1 ? 0.45 : 1) * (1 - 0.6 * ss(0.55, 1, y / rows))

  const esc = (c: string): string => (c === '<' ? '&lt;' : c === '&' ? '&amp;' : c === '>' ? '&gt;' : c)
  const line = (cells: { ch: string; cl: string }[]): string => {
    let out = ''
    let run = ''
    let cur = ''

    for (const { ch, cl } of cells) {
      if (ch !== ' ' && cl !== cur) {
        if (run !== '') {
          out += cur === '' ? run : `<tspan class="${cur}">${run}</tspan>`
        }
        run = ''
        cur = cl
      }
      run += esc(ch)
    }
    run = run.replace(/ +$/, '')
    if (run !== '') {
      out += cur === '' ? run : `<tspan class="${cur}">${run}</tspan>`
    }

    return out
  }
  const BLANK = { ch: ' ', cl: '' }
  const LH = 16
  const row = (y: number, cells: { ch: string; cl: string }[]): string => {
    const body = line(cells)

    return body === '' ? '' : `<text y="${(y + 1) * LH}">${body}</text>`
  }

  // Các lớp: hình đã thành (tĩnh; mặt nước có 3 khung gợn), nhiễu còn lại, vệt accent ở mép trật tự,
  // và dải đang hội tụ (K nhóm, mỗi nhóm đổi nhiễu thành hình đúng một lần).
  const K = 5
  const still: string[] = []
  const waves: string[][] = [[], [], []]
  const noise: string[] = []
  const front: string[] = []
  const bandNoise: string[][] = Array.from({ length: K }, () => [])
  const bandFlash: string[][] = Array.from({ length: K }, () => [])
  const bandForm: string[][] = Array.from({ length: K }, () => [])
  const FW = 0.022

  for (let y = 0; y < rows; y++) {
    const cells: Cell[] = []

    for (let x = 0; x < cols; x++) {
      cells.push(cell(x, y, 0))
    }
    const isWaterRow = cells[0]?.isWater === true
    const formed = cells.map(c => (c.t <= pFrom ? c : BLANK))

    if (isWaterRow) {
      for (let f = 0; f < 3; f++) {
        const fc = f === 0 ? formed : cells.map((c, x) => (c.t <= pFrom ? cell(x, y, f * 1.3) : BLANK))

        waves[f]!.push(row(y, fc))
      }
    } else {
      still.push(row(y, formed))
    }
    noise.push(row(y, cells.map((c, x) => (c.t > pTo + FW && hasNoise(c, x, y) ? { ch: c.noise, cl: 'nz' } : BLANK))))
    if (pTo < 1) {
      front.push(row(y, cells.map(c => (c.t > pTo && c.t <= pTo + FW && c.zone !== 0 && c.ch !== ' ' ? { ch: c.ch, cl: 'fr' } : BLANK))))
    }
    if (pTo > pFrom) {
      for (let k = 0; k < K; k++) {
        const inBand = (c: Cell): boolean => {
          const q = Math.min(K - 1, Math.floor(((c.t - pFrom) / (pTo - pFrom)) * K))

          return c.t > pFrom && c.t <= pTo && q === k
        }

        bandNoise[k]!.push(row(y, cells.map((c, x) => (inBand(c) && hasNoise(c, x, y) ? { ch: c.noise, cl: 'nz' } : BLANK))))
        bandFlash[k]!.push(row(y, cells.map(c => (inBand(c) && c.ch !== ' ' ? { ch: c.ch, cl: 'fr' } : BLANK))))
        bandForm[k]!.push(row(y, cells.map(c => (inBand(c) ? c : BLANK))))
      }
    }
  }

  // Vài sao ở nửa trên, chỉ khi trời còn tối.
  const stars: string[] = []
  const starN = Math.round(14 * (1 - Math.min(1, (o.progress ?? 0.5) * 1.2)))

  for (let i = 0; i < starN; i++) {
    const x = Math.floor(hash(i, 3, 77) * cols)
    const y = Math.floor(hash(i, 5, 78) * rows * 0.3)

    if (zoneOf(x) !== 2) {
      continue
    }

    stars.push(`<text class="st s${i % 3}" x="${(x * 7.8).toFixed(1)}" y="${(y + 1) * LH}">+</text>`)
  }

  const css = [...palette].map(([rgb, name]) => `.${name}{fill:rgb(${rgb})}`).join('')
  const W = Math.round(cols * 7.8)
  const H = rows * LH + 4
  const delay = (k: number): number => 0.5 + k * 0.24
  const band =
    pTo > pFrom
      ? Array.from({ length: K }, (_, k) => {
          const d = delay(k)

          return (
            `<g class="nz bo" style="animation-duration:${d.toFixed(2)}s">${bandNoise[k]!.join('')}</g>` +
            `<g class="fr bf" style="animation-delay:${d.toFixed(2)}s">${bandFlash[k]!.join('')}</g>` +
            `<g class="bi" style="animation-delay:${(d + 0.14).toFixed(2)}s">${bandForm[k]!.join('')}</g>`
          )
        }).join('')
      : ''
  const motion =
    '.nz{fill:#8d8376;fill-opacity:.34}.fr{fill:#d97a4a}' +
    '.w{opacity:0;animation:w 6s steps(1,end) 3}.w0{opacity:1}.w1{animation-delay:-2s}.w2{animation-delay:-4s}' +
    '@keyframes w{0%{opacity:1}33.4%{opacity:0}}' +
    // The end state never rests on a fill mode: noise and flash are hidden by their base style, forms shown by theirs.
    '.bo{opacity:0;animation:bo 1s steps(1,end) 1}@keyframes bo{from,to{opacity:1}}' +
    '.bf{opacity:0;animation:bf .5s ease-out 1 backwards}@keyframes bf{0%{opacity:0}1%{opacity:1}100%{opacity:0}}' +
    '.bi{animation:bi .3s ease-out 1 backwards}@keyframes bi{from{opacity:0}to{opacity:1}}' +
    '.st{fill:#f4ecff;opacity:.25;animation:t 5s ease-in-out 2 alternate}.s1{animation-delay:-1.7s}.s2{animation-delay:-3.3s}@keyframes t{to{opacity:.8}}' +
    '@media (prefers-reduced-motion:reduce){.w,.st,.bo,.bf,.bi{animation:none!important}.w1,.w2,.bo,.bf{opacity:0}}'

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" class="nbs" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">` +
    `<style>${scopeCSS(`text{font:13px "JetBrains Mono",ui-monospace,Menlo,Consolas,monospace;white-space:pre}${css}${motion}`, 'nbs')}</style>` +
    `<rect width="${W}" height="${H}" fill="#0f0d0b"/>` +
    `<g>${stars.join('')}</g>` +
    `<g class="nz">${noise.join('')}</g>` +
    `<g class="fr" fill-opacity=".6">${front.join('')}</g>` +
    `<g>${still.join('')}</g>` +
    waves.map((rowsF, f) => `<g class="w w${f}">${rowsF.join('')}</g>`).join('') +
    band +
    `</svg>`
  )
}
