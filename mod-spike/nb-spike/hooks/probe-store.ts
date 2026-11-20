// Phép thử 4 (C10): câu viết sẵn của mascot, dịch một lần rồi lưu trong $.store.
//
// /spike-lang vi  -> nếu $.store đã có bản "vi" thì dùng lại (0 token); nếu chưa, một lần $.model.complete
//                    dịch cả bộ câu, lưu vào $.store. Nhật ký ghi số token đã tốn.
// Thử đủ: chạy /spike-lang vi, thoát hẳn Desktop, mở lại, chạy /spike-lang vi lần nữa: phải báo "lấy từ kho".
import { atom, read, update } from 'claude-code'

import type { Dollar } from './state.js'
import { note } from './state.js'

// Atoms: cùng {plugin, key} ở mọi file thì là một giá trị; bộ quét của engine chỉ đọc atom khai báo ngay trong file dùng nó.
const langAtom = atom({ plugin: 'nb-spike', key: 'lang' } as const, 'en')
const linesAtom = atom({ plugin: 'nb-spike', key: 'lines' } as const, {}, { shape: 'lines-1' })

export const LINES_EN: Record<string, string> = {
  ready: 'Ready when you are. What is the real problem?',
  working: 'Claude is working. Take a breath.',
  done: 'Claude is done. Does it meet your "done" criteria?',
  long: 'The context is getting full. A good moment to close this task.',
  accepted: 'You accepted it. Write one lesson in decisions.md?',
}

const KEY = (lang: string) => `nb-spike.lines.${lang}`

export async function loadLines($: Dollar, lang: string): Promise<Record<string, string> | null> {
  if (lang === 'en') {
    return LINES_EN
  }
  const saved = await $.store.get(KEY(lang))

  if (saved !== null && typeof saved === 'object') {
    return saved as Record<string, string>
  }

  return null
}

export async function switchLang($: Dollar, lang: string): Promise<string> {
  const code = lang.trim().toLowerCase()

  if (!/^[a-z]{2,3}(-[a-z]{2,4})?$/.test(code)) {
    return 'Dùng: /spike-lang <mã ngôn ngữ>, ví dụ vi, fr, ja, hoặc en.'
  }

  const saved = await loadLines($, code)

  if (saved !== null) {
    await update($, linesAtom, () => saved)
    await update($, langAtom, () => code)
    await note($, 'store', `${code}: lấy từ kho ($.store), 0 token`)

    return `Đã đổi sang "${code}" (lấy từ kho, 0 token).`
  }

  const model = 'haiku'
  const result = await $.model.complete({
    model,
    prompt:
      `Translate the values of this JSON object into the language with code "${code}". ` +
      'Keep the keys, keep the quotes inside values, keep the tone warm and short. Reply with the JSON object only.\n' +
      JSON.stringify(LINES_EN),
  })

  if (!result.isAnswered) {
    await note($, 'store', `${code}: model.complete không trả lời: ${result.reason}`)

    return `Không dịch được: ${result.reason}`
  }

  let parsed: Record<string, string>

  try {
    const body = result.text.replace(/^```(?:json)?\s*|\s*```$/g, '')
    parsed = JSON.parse(body) as Record<string, string>
  } catch {
    await note($, 'store', `${code}: model trả về thứ không phải JSON`)

    return 'Model trả về thứ không phải JSON; chưa lưu gì.'
  }

  const missing = Object.keys(LINES_EN).filter(k => typeof parsed[k] !== 'string')

  if (missing.length > 0) {
    await note($, 'store', `${code}: thiếu khoá ${missing.join(',')}`)

    return `Bản dịch thiếu khoá ${missing.join(', ')}; chưa lưu.`
  }

  await $.store.set(KEY(code), parsed)
  await update($, linesAtom, () => parsed)
  await update($, langAtom, () => code)
  await note(
    $,
    'store',
    `${code}: dịch bằng ${model} và đã lưu; token vào ${result.usage.input_tokens}, ra ${result.usage.output_tokens}`,
  )

  return `Đã dịch sang "${code}" và lưu vào kho (${result.usage.input_tokens + result.usage.output_tokens} token, tính vào hạn mức của bạn).`
}

export async function currentLines($: Dollar): Promise<Record<string, string>> {
  const lines = await read($, linesAtom)

  return Object.keys(lines).length > 0 ? lines : LINES_EN
}
