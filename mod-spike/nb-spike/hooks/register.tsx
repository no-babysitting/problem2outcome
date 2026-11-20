// nb-spike: một mod gộp bốn phép thử khả thi cho mod problem2outcome trên Claude Desktop (PDD mục 13).
//   1. probe-strip   C9   cắt dòng <nb> khỏi AssistantMessage
//   2. probe-anim    C11  Client + nền $.theme.set + $.session.usage (cùng C14, C15)
//   3. probe-hold    C8   giữ tool call ghi file đầu tiên, hỏi bằng $.ui.ask
//   4. probe-store   C10  câu đã dịch lưu trong $.store
// Lệnh: commands.ts (C14, C15, C18, /spike-report).
import type { Register } from 'claude-code'

import { declareCommands, registerCommands } from './commands.js'
import { registerAnim, startAnim } from './probe-anim.js'
import { registerHold } from './probe-hold.js'
import { registerStrip } from './probe-strip.js'

export const register: Register = (on, options) => {
  // Một hook session.start duy nhất: engine từ chối hai hook cùng sự kiện, cùng không matcher.
  on('session.start', async ($, e, next) => {
    await declareCommands($)
    await startAnim($, e.surface)

    return next(e)
  })

  registerStrip(on, options)
  registerAnim(on, options)
  registerHold(on, options)
  registerCommands(on, options)
}
