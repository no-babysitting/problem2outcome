// Lệnh gạch chéo: chạy không cần lượt của Claude, 0 token (trừ /spike-lang lần dịch đầu).
//   /spike-report            in nhật ký các phép thử để dán lại cho Claude
//   /spike-strip|anim|hold|store on|off   bật/tắt từng phép thử
//   /spike-anim 100|50|33    đổi chu kỳ tick của mascot (ms) để thử trần vẽ 10 lần/giây
//   /spike-lang <mã>         C10: đổi ngôn ngữ câu viết sẵn (dịch một lần rồi lưu)
//   /mascot quiet|normal|chatty   C14: mức nói của mascot
//   /spike-usage off|numbers|bar  C15: cách hiện token và hạn mức
//   /grill-me, /challenge-me, /teach-me   C18: điền sẵn câu vào ô nhập
import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Level, ProbeId, UsageView } from '../types'

import { switchLang } from './probe-store.js'
import type { Dollar } from './state.js'
import { counters, note, setOn } from './state.js'

// Atoms: cùng {plugin, key} ở mọi file thì là một giá trị; bộ quét của engine chỉ đọc atom khai báo ngay trong file dùng nó.
const logAtom = atom({ plugin: 'nb-spike', key: 'log' } as const, [], { shape: 'log-1' })
const onAtom = atom({ plugin: 'nb-spike', key: 'on' } as const, { strip: true, anim: true, hold: true, store: true }, { shape: 'on-1' })
const askedAtom = atom({ plugin: 'nb-spike', key: 'asked' } as const, false)
const tickMsAtom = atom({ plugin: 'nb-spike', key: 'tickMs' } as const, 100)
const levelAtom = atom({ plugin: 'nb-spike', key: 'level' } as const, 'normal' as Level)
const usageViewAtom = atom({ plugin: 'nb-spike', key: 'usageView' } as const, 'numbers' as UsageView)
const usageAtom = atom({ plugin: 'nb-spike', key: 'usage' } as const, null, { shape: 'usage-1' })

const PROBES: readonly ProbeId[] = ['strip', 'anim', 'hold', 'store']
const LEVELS: readonly Level[] = ['quiet', 'normal', 'chatty']
const VIEWS: readonly UsageView[] = ['off', 'numbers', 'bar']

// C18: câu điền sẵn. Người dùng sửa được rồi mới bấm Enter; mod không tự gửi.
const PRESETS: Record<string, string> = {
  'grill-me':
    'Grill me on this task: ask me one question at a time, only questions that could change direction, until the real problem is clear. ',
  'challenge-me':
    'Challenge my plan: tell me the weakest assumption and what would prove me wrong, then let me decide. ',
  'teach-me':
    'Teach me about this: find the official docs, summarise them in a few lines with links, and do not lecture. ',
}

const COMMANDS: { name: string; description: string; argumentHint?: string }[] = [
  { name: 'spike-report', description: 'In nhật ký các phép thử của spike để dán lại' },
  { name: 'spike-strip', description: 'Phép thử 1: bật/tắt cắt dòng <nb>', argumentHint: 'on|off' },
  { name: 'spike-anim', description: 'Phép thử 2: bật/tắt, hoặc đổi chu kỳ tick (ms)', argumentHint: 'on|off|100|50|33' },
  { name: 'spike-hold', description: 'Phép thử 3: bật/tắt, hoặc đặt lại để hỏi lần nữa', argumentHint: 'on|off|reset' },
  { name: 'spike-lang', description: 'Phép thử 4: đổi ngôn ngữ câu viết sẵn của mascot', argumentHint: '<mã ngôn ngữ>' },
  { name: 'mascot', description: 'C14: đổi mức nói của mascot', argumentHint: 'quiet|normal|chatty' },
  { name: 'spike-usage', description: 'C15: cách hiện token và hạn mức', argumentHint: 'off|numbers|bar' },
  ...Object.keys(PRESETS).map(name => ({ name, description: `C18: điền sẵn câu "${name}" vào ô nhập` })),
]

const toggleProbe = (probe: ProbeId, arg: string): ((rec: Record<ProbeId, boolean>) => Record<ProbeId, boolean>) | null =>
  arg === 'on' ? setOn(probe, true) : arg === 'off' ? setOn(probe, false) : null

// Gọi từ hook session.start duy nhất trong register.tsx.
export async function declareCommands($: Dollar): Promise<void> {
  for (const command of COMMANDS) {
    await $.command.register(command)
  }
}

export const registerCommands: Register = on => {
  on('command.run', async ($, e, next) => {
    const arg = e.args.trim()
    const name = e.command

    if (name === 'spike-report') {
      const log = await read($, logAtom)
      const usage = await read($, usageAtom)
      const version = await $.session.version()
      const head = [
        `nb-spike report · Claude Code ${version.version}`,
        `usage: ${usage === null ? 'chưa có' : JSON.stringify(usage)}`,
        `probes: ${JSON.stringify(await read($, onAtom))}`,
        `strip: AssistantMessage vẽ ${counters.renders} lần, thấy thẻ dở ${counters.partialSeen} lần, thấy thẻ đủ ${counters.completeSeen} lần`,
        `strip: độ dài từng lần vẽ gần nhất (p = thẻ dở, n = có <nb>): ${counters.samples.join(' ') || '(chưa có)'}`,
      ]
      const body = log.map(l => `${new Date(l.at).toISOString().slice(11, 19)} [${l.probe}] ${l.text}`)

      return { text: [...head, '', ...(body.length > 0 ? body : ['(nhật ký trống)'])].join('\n') }
    }

    const probe = PROBES.find(p => name === `spike-${p}`)

    if (probe !== undefined) {
      if (probe === 'hold' && arg === 'reset') {
        await update($, askedAtom, () => false)

        return { text: 'Đã đặt lại: tool call ghi file kế tiếp sẽ bị giữ để hỏi.' }
      }
      if (probe === 'anim' && /^\d+$/.test(arg)) {
        const ms = Math.min(1000, Math.max(16, Number(arg)))

        await update($, tickMsAtom, () => ms)
        await note($, 'anim', `đổi chu kỳ tick sang ${ms} ms`)

        return { text: `Tick mascot: ${ms} ms (mục tiêu ${Math.round(1000 / ms)} khung/giây). Xem số khung đo được ở dòng trạng thái.` }
      }
      const change = toggleProbe(probe, arg)

      if (change === null) {
        return { text: `Dùng: /spike-${probe} on|off` }
      }
      await update($, onAtom, change)

      return { text: `Phép thử "${probe}": ${arg}. Một số thay đổi (nền, dải trên ô nhập) hiện từ phiên mới.` }
    }

    if (name === 'spike-lang') {
      return { text: await switchLang($, arg) }
    }

    if (name === 'mascot') {
      const level = LEVELS.find(l => l === arg)

      if (level === undefined) {
        return { text: `Dùng: /mascot ${LEVELS.join('|')}` }
      }
      await update($, levelAtom, () => level)

      return { text: `Mascot: ${level}.` }
    }

    if (name === 'spike-usage') {
      const view = VIEWS.find(v => v === arg)

      if (view === undefined) {
        return { text: `Dùng: /spike-usage ${VIEWS.join('|')}` }
      }
      await update($, usageViewAtom, () => view)

      return { text: `Hiện token và hạn mức: ${view}.` }
    }

    const preset = PRESETS[name]

    if (preset !== undefined) {
      const filled = await $.prompt.fill({ text: preset })

      await note($, 'misc', `/${name}: prompt.fill isFilled=${filled.isFilled}`)

      return { text: filled.isFilled ? 'Đã điền sẵn vào ô nhập. Sửa rồi bấm Enter.' : 'Không điền được vào ô nhập lúc này.' }
    }

    return next(e)
  }).catch(($, e, next) => next(e))
}
