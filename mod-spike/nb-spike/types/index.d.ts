export type ProbeId = 'strip' | 'anim' | 'hold' | 'store'

export type Level = 'quiet' | 'normal' | 'chatty'

export type UsageView = 'off' | 'numbers' | 'bar'

export type LogLine = { at: number; probe: string; text: string }

export type UsageSummary = {
  contextPercent: number | null
  contextTokens: number | null
  contextWindow: number | null
  limits: { kind: string; percentUsed: number }[]
  costUsd: number | null
}

declare module 'claude-code' {
  interface PluginState {
    'nb-spike': {
      /** Nhật ký các phép thử, in ra bằng /spike-report. */
      log: Shaped<LogLine[]>
      /** Công tắc từng phép thử. */
      on: Shaped<Record<ProbeId, boolean>>
      /** Dòng <nb> mới nhất đã cắt khỏi câu trả lời. */
      nbLine: string
      /** C14: mức nói của mascot. */
      level: Level
      /** C15: cách hiện token và hạn mức. */
      usageView: UsageView
      usage: Shaped<UsageSummary | null>
      /** Nhịp vẽ của Client mascot do hook đo được (khung hình mỗi giây). */
      fps: number
      /** Chu kỳ tick của mascot, ms. */
      tickMs: number
      /** C10: ngôn ngữ đang dùng cho câu viết sẵn. */
      lang: string
      /** C10: câu viết sẵn theo ngôn ngữ đang dùng. */
      lines: Shaped<Record<string, string>>
      /** C8: đã hỏi "thế nào là xong" trong phiên này chưa. */
      asked: boolean
    }
  }
}
