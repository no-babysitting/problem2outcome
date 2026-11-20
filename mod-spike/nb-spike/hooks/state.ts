import { atom, read, update } from 'claude-code'
import type { EngineInterface } from 'claude-code'

import type { Level, LogLine, ProbeId, UsageSummary, UsageView } from '../types'

// Atoms: cùng {plugin, key} ở mọi file thì là một giá trị; bộ quét của engine chỉ đọc atom khai báo ngay trong file dùng nó.
const logAtom = atom({ plugin: 'nb-spike', key: 'log' } as const, [], { shape: 'log-1' })
const onAtom = atom({ plugin: 'nb-spike', key: 'on' } as const, { strip: true, anim: true, hold: true, store: true }, { shape: 'on-1' })



export type Dollar = EngineInterface

// Số liệu của hook vẽ (ui.render không được ghi state, nên đếm vào biến của module; mất khi nạp lại mod).
export const counters = { renders: 0, partialSeen: 0, completeSeen: 0, samples: [] as string[] }

/** Ghi một dòng nhật ký: `/spike-report` in lại, và `claude --debug` thấy cùng dòng. */
export async function note($: Dollar, probe: ProbeId | 'misc', text: string): Promise<void> {
  const at = await $.clock.now()
  const line: LogLine = { at, probe, text }

  $.ui.log(`[nb-spike/${probe}] ${text}`, { to: 'debug' })
  await update($, logAtom, (list: LogLine[]) => [...list, line].slice(-80))
}

export async function isOn($: Dollar, probe: ProbeId): Promise<boolean> {
  return (await read($, onAtom))[probe]
}

export const setOn = (probe: ProbeId, value: boolean) => (rec: Record<ProbeId, boolean>) => ({ ...rec, [probe]: value })

export const summarize = (u: any): UsageSummary => ({
  contextPercent: u?.context?.percent ?? null,
  contextTokens: u?.context?.tokens ?? null,
  contextWindow: u?.context?.window ?? null,
  limits: (u?.rateLimits ?? []).map((r: any) => ({ kind: String(r.kind), percentUsed: Number(r.percentUsed) })),
  costUsd: typeof u?.cost?.totalUsd === 'number' ? u.cost.totalUsd : null,
})
