// Phép thử 3 (C8): giữ tool call đầu tiên ghi file để hỏi "thế nào là xong".
//
// Câu hỏi của spike: hộp hỏi của $.ui.ask có hiện đúng chỗ, không chồng lên hộp xin quyền của Claude Code,
// và thứ tự hai hộp ra sao. Mod không đoán được thứ tự; nhật ký ghi giờ hỏi và giờ trả lời,
// còn người thử ghi lại điều mình thấy trên màn hình.
//
// Mod không tự duyệt tool call (C13): hỏi xong vẫn `next(e)`, hộp xin quyền của Claude Code vẫn do người dùng bấm.
import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import { isOn, note } from './state.js'

// Atoms: cùng {plugin, key} ở mọi file thì là một giá trị; bộ quét của engine chỉ đọc atom khai báo ngay trong file dùng nó.
const askedAtom = atom({ plugin: 'nb-spike', key: 'asked' } as const, false)

const WRITES = new Set(['Write', 'Edit', 'MultiEdit', 'NotebookEdit'])

const READY = 'Đã có tiêu chí, cứ làm'
const NOT_YET = 'Chưa, để tôi nói'
const SKIP = 'Đừng hỏi nữa trong phiên này'

export const registerHold: Register = on => {
  on('tool.call', async ($, e, next) => {
    if (!WRITES.has(e.tool) || !(await isOn($, 'hold')) || (await read($, askedAtom))) {
      return next(e)
    }

    // Đánh dấu trước khi hỏi: hai lần ghi liên tiếp không được hỏi hai lần.
    await update($, askedAtom, () => true)

    const started = await $.clock.now()
    await note($, 'hold', `giữ ${e.tool} (${e.tool_use_id}), hỏi bằng $.ui.ask`)

    let answer: string

    try {
      answer = await $.ui.ask('Trước khi Claude ghi file đầu tiên: thế nào là xong với việc này?', {
        header: 'Thế nào là xong?',
        options: [READY, NOT_YET, SKIP],
      })
    } catch {
      await note($, 'hold', 'ui.ask bị đóng không trả lời; cho tool call chạy tiếp')

      return next(e)
    }

    const waited = (await $.clock.now()) - started
    await note($, 'hold', `trả lời "${answer}" sau ${Math.round(waited / 100) / 10}s`)

    if (answer === NOT_YET) {
      return {
        deny:
          'The user wants to say what "done" means before any file is written. Ask them that in one short question, wait for the answer, then retry.',
      }
    }

    return next(e)
  }).catch(($, e, next) => next(e))
}
