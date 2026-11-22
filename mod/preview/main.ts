// Preview of the NB mod for a browser: the real band and scene code, drawn in a mock Desktop window.
// Build: bun build mod/preview/main.ts --outfile mod/preview/main.js --target browser
import type { ColleagueState, Lang } from '../nb/types'

import { bandSVG } from '../nb/hooks/band-svg.js'
import { presetLine } from '../nb/hooks/colleague.js'
import { parseDecisions, progressOf } from '../nb/hooks/decisions.js'
import { asciiSceneSVG } from '../nb/hooks/scene.js'
import { statusText } from '../nb/hooks/status.js'

const TEMPLATE = (size: string, made: number, accepted: boolean): string => {
  const larger = size === 'larger'
  const s1 = larger && made >= 1 ? 'Khách cũ quên studio vì 8 tháng chưa liên lạc.' : ''
  const s2 = made >= (larger ? 2 : 1) ? '- [ ] Dưới 150 chữ\n- [ ] Hạn chót 20/12 rõ ràng' : '- [ ] '
  const s3 = larger && made >= 3 ? 'Claude viết nháp; tôi chọn ảnh và gửi.' : ''
  const s4 = accepted ? 'accepted on first try' : 'accepted on first try | redo (why)'

  const ok = (yes: boolean): string => `Confirmed: ${yes ? 'yes' : 'no'}`

  return `# Task: Email mời chụp ảnh Tết\n\nDate: 2026-11-20 · Size: ${size}\n\n## 1. Real problem\n${ok(s1 !== '')}\n${s1}\n\n## 2. Done means\n${ok(s2 !== '- [ ] ')}\n${s2}\n\n## 3. Delegate / keep\n${ok(s3 !== '')}\n${s3}\n\n## 4. Result\n- Decision: ${s4}\n`
}

const $ = (id: string): HTMLInputElement => document.getElementById(id) as HTMLInputElement
// Like the mod: redraw only when the share of decisions changes, converging from the last one (M11).
let shown: { progress: number; source: string } | null = null

function draw(): void {
  const state = $('state').value as ColleagueState
  const lang = $('lang').value as Lang
  const size = $('size').value
  const steps = size === 'larger' ? 4 : 2
  const made = Math.min(Number($('made').value), steps)
  const noTask = $('notask').checked
  const d = noTask ? null : parseDecisions(TEMPLATE(size, Math.min(made, steps - 1), made >= steps))
  const custom = $('line').value.trim()
  const line = custom !== '' ? custom : presetLine(lang, d, noTask)
  const ctx = Number($('ctx').value)
  const progress = Math.round(progressOf(d) * 4) / 4

  $('madeOut').value = `${made}/${steps}`
  $('ctxOut').value = `${ctx}%`

  if (shown === null || shown.progress !== progress) {
    shown = { progress, source: asciiSceneSVG({ progress, from: shown === null ? 0 : shown.progress }) }
  }
  const scene = shown.source
  const sceneOn = $('scene').checked

  document.getElementById('backdrop')!.innerHTML = sceneOn ? scene : ''
  document.getElementById('band')!.innerHTML = bandSVG({
    state,
    line: state === 'asking' ? '' : line,
    isStale: false,
    decisions: d,
    contextPercent: ctx,
    limit: { kind: 'five_hour', percentUsed: 37 },
    lang,
  })
  // The /nb command's text, as the mod writes it, lightly coloured. me.md appears once the task is accepted.
  const accepted = d !== null && made >= steps
  const text = statusText({ lang, task: d, levels: accepted ? ['guide', 'guide', 'guide', 'guide'] : null, level: 'normal', scene: sceneOn })
  const esc = (t: string): string => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const KEY: Record<string, string> = { '✓': 'k-done', '↺': 'k-redo', '–': 'k-skip' }

  document.getElementById('status')!.innerHTML = text
    .split('\n')
    .map(l => {
      const row = /^\[(.)\] (.+?)( · (.*))?$/.exec(l)

      if (row !== null) {
        const [, k = '', label = '', , note = ''] = row
        const isNext = note.startsWith('▍')

        return `<span class="${KEY[k] ?? 'k-num'}">[${esc(k)}]</span> <span class="lab${isNext ? ' next' : ''}">${esc(label)}</span>${note === '' ? '' : ` · ${esc(note)}`}`
      }
      const head = /^([^·]+?) · (.*)$/.exec(l)

      return head === null ? esc(l) : `<span class="lab">${esc(head[1] ?? '')}</span> · ${esc(head[2] ?? '').replace(/(\/[a-z-]+)/g, '<span class="cmd">$1</span>')}`
    })
    .join('\n')
  document.getElementById('sceneNote')!.textContent =
    lang === 'vi' ? `Mặt trời ở mức ${progress * 4}/4: theo số quyết định đã chốt.` : `Sun at ${progress * 4}/4: follows the decisions made.`
}

for (const id of ['state', 'lang', 'size', 'made', 'notask', 'line', 'ctx', 'scene']) {
  $(id).addEventListener('input', draw)
}
draw()
