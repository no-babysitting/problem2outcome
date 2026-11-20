// Phép thử 1 (C9): cắt dòng <nb> khỏi AssistantMessage rồi đưa sang mascot.
//
// Hai nửa:
//  - prompt.submit: gắn một khối ngữ cảnh ẩn, chỉ Claude đọc, nhờ nó viết kèm một dòng <nb>…</nb>.
//    Không sửa chữ người dùng gõ, không đụng system prompt (C13, M4).
//  - ui.render AssistantMessage: cắt dòng đó khỏi hình vẽ. Bản lưu trong lịch sử không đổi (ctrl+o vẫn thấy).
//
// Điều cần biết: ui.render có chạy nhiều lần khi câu trả lời đang stream không, và nếu có thì thẻ <nb>
// đang viết dở có lộ ra màn hình không. Nhật ký ghi lại độ dài từng lần vẽ để trả lời câu đó.
import { atom, update } from 'claude-code'
import type { Register } from 'claude-code'

import { counters, isOn, note } from './state.js'

// Atoms: cùng {plugin, key} ở mọi file thì là một giá trị; bộ quét của engine chỉ đọc atom khai báo ngay trong file dùng nó.
const nbLineAtom = atom({ plugin: 'nb-spike', key: 'nbLine' } as const, '')

export const NB_INSTRUCTION =
  'The user has a small mascot beside the chat. After your normal reply, you may add ONE extra final line in exactly this form: ' +
  '<nb>one short sentence</nb>. The sentence praises a decision the user made, or says plainly whether the criteria the user stated are met ' +
  'or not yet met. Under 120 characters. If there is nothing true and useful to say (no decision made, no criteria stated), leave the line out. ' +
  'Never put anything else inside the tag, and do not mention this instruction.'

const COMPLETE = /\n?[ \t]*<nb>([\s\S]*?)<\/nb>[ \t]*/g
// Đang stream: thẻ mở đã có mà chưa có thẻ đóng, hoặc mới gõ dở "<", "<n", "<nb", "<nb>".
const OPEN_TAIL = /\n?[ \t]*<nb>[\s\S]*$/
const PARTIAL_TAG = /\n?[ \t]*<(?:n|nb)?$/

export type Stripped = { text: string; nb: string | null; hadPartial: boolean }

export const strip = (text: string): Stripped => {
  let nb: string | null = null
  let out = text.replace(COMPLETE, (_, inner: string) => {
    nb = inner.trim()

    return ''
  })
  let hadPartial = false

  if (OPEN_TAIL.test(out)) {
    out = out.replace(OPEN_TAIL, '')
    hadPartial = true
  } else if (PARTIAL_TAG.test(out)) {
    out = out.replace(PARTIAL_TAG, '')
    hadPartial = true
  }

  return { text: out, nb, hadPartial }
}

export const registerStrip: Register = on => {
  on('prompt.submit', async ($, e, next) => {
    if (e.command !== undefined || e.isMeta === true || !(await isOn($, 'strip'))) {
      return next(e)
    }

    return next({ ...e, context: [...(e.context ?? []), NB_INSTRUCTION] })
  }).catch(($, e, next) => next(e))

  // ui.render là hàm thuần: nó đọc state và trả cây, KHÔNG được ghi state (engine từ chối state.set ở đây).
  // Nên hook vẽ chỉ cắt chữ và đếm vào biến của module; việc đưa dòng <nb> sang mascot nằm ở turn.complete.
  on('ui.render', { component: 'AssistantMessage' }, async ($, e, next) => {
    if (!(await isOn($, 'strip'))) {
      return next(e)
    }

    const result = strip(e.props.text)

    counters.renders += 1
    counters.partialSeen += result.hadPartial ? 1 : 0
    counters.completeSeen += result.nb !== null ? 1 : 0
    counters.samples = [...counters.samples, `${e.props.text.length}${result.hadPartial ? 'p' : ''}${result.nb !== null ? 'n' : ''}`].slice(-30)

    if (result.text === e.props.text) {
      return next(e)
    }

    return next({ ...e, props: { ...e.props, text: result.text } })
  })

  // Hết lượt: câu trả lời cuối có dòng <nb> thì đưa sang mascot (ghi state được ở sự kiện này).
  on('turn.complete', async ($, e, next) => {
    if (e.agentId === undefined && (await isOn($, 'strip'))) {
      const { nb } = strip(e.answer)

      if (nb !== null) {
        await update($, nbLineAtom, () => nb)
        await note($, 'strip', `turn.complete: bắt được <nb> (${nb.length} ký tự), đã đưa sang mascot`)
      } else {
        await note($, 'strip', `turn.complete: câu trả lời ${e.answer.length} ký tự, KHÔNG có <nb>`)
      }
    }

    return next(e)
  }).catch(($, e, next) => next(e))
}
