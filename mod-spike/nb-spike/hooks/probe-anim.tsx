// Phép thử 2 (C11) cùng C14 và C15: hoạt ảnh Client, nền $.theme.set, mascot và số token.
//
// Câu hỏi của spike: Client và nền SVG có chạy mượt trên Desktop với trần 10 lần vẽ mỗi giây không;
// nền có đổi theo context mà không giật; hook đo được nhịp thật là bao nhiêu khung mỗi giây.
import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import { currentLines } from './probe-store.js'
import { sceneAlt, sceneFor, SCENE_NAME } from './scene.js'
import type { Level, UsageView } from '../types'

import type { Dollar } from './state.js'
import { isOn, note, summarize } from './state.js'

// Atoms: cùng {plugin, key} ở mọi file thì là một giá trị; bộ quét của engine chỉ đọc atom khai báo ngay trong file dùng nó.
const usageAtom = atom({ plugin: 'nb-spike', key: 'usage' } as const, null, { shape: 'usage-1' })
const levelAtom = atom({ plugin: 'nb-spike', key: 'level' } as const, 'normal' as Level)
const usageViewAtom = atom({ plugin: 'nb-spike', key: 'usageView' } as const, 'numbers' as UsageView)
const nbLineAtom = atom({ plugin: 'nb-spike', key: 'nbLine' } as const, '')
const tickMsAtom = atom({ plugin: 'nb-spike', key: 'tickMs' } as const, 100)
const fpsAtom = atom({ plugin: 'nb-spike', key: 'fps' } as const, 0)

const GLASS = { blur: 6, tint: '#0b1220', opacity: 0.55 } as const

const moodOf = (percent: number | null): 'calm' | 'busy' | 'tired' =>
  percent === null || percent < 50 ? 'calm' : percent < 80 ? 'busy' : 'tired'

// Gọi từ hook session.start duy nhất trong register.tsx.
export async function startAnim($: Dollar, surface: string | null): Promise<void> {
  const usage = summarize(await $.session.usage())

  await update($, usageAtom, () => usage)

  if (await isOn($, 'anim')) {
    const set = await $.theme.set({ backdrop: { scene: SCENE_NAME, glass: GLASS } })

    await note($, 'anim', `theme.set: isDrawn=${set.isDrawn}${set.isDrawn ? '' : `, reason=${set.reason}`} (surface=${surface})`)
  }
}

export const registerAnim: Register = on => {
  // Sau mỗi lượt và khi % hạn mức đổi: 0 token, chỉ cập nhật số để nền và mascot vẽ lại.
  on('session.measure', async ($, e, next) => {
    await update($, usageAtom, () => summarize(e))

    return next(e)
  })

  let backdropRenders = 0

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== SCENE_NAME) {
      return next(e)
    }

    backdropRenders += 1

    if (backdropRenders <= 3 || backdropRenders % 10 === 0) {
      await note($, 'anim', `Backdrop đã vẽ ${backdropRenders} lần`)
    }
    const usage = await read($, usageAtom)
    const { Svg } = $.ui.resolve(e)

    return <Svg source={sceneFor(usage?.contextPercent ?? null)} alt={sceneAlt} isInteractive />
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || !(await isOn($, 'anim'))) {
      return next(e)
    }

    if (e.surface !== 'terminal' && e.surface !== 'desktop') {
      return next(e) // Client chỉ có ở terminal và Desktop, không có ở VS Code hay mobile.
    }

    const { Box, Client, Progress, Text } = $.ui.resolve(e)
    const level = await read($, levelAtom)
    const usage = await read($, usageAtom)
    const view = await read($, usageViewAtom)
    const nb = await read($, nbLineAtom)
    const tickMs = await read($, tickMsAtom)
    const fps = await read($, fpsAtom)
    const lines = await currentLines($)

    // C14: quiet = không lời; normal = chỉ dòng <nb> của Claude; chatty = thêm câu viết sẵn khi chưa có <nb>.
    const line = level === 'quiet' ? '' : nb !== '' ? nb : level === 'chatty' ? lines.ready ?? '' : ''

    const limit = usage?.limits[0]

    return (
      <Box flexDirection="column">
        <Client
          key={`mascot-${tickMs}`}
          module="./mascot.tsx"
          props={{ line, mood: moodOf(usage?.contextPercent ?? null), tickMs, show: level !== 'quiet' }}
          height={2}
        />
        {view === 'numbers' && usage !== null && (
          <Text dimColor>
            Context {usage.contextPercent ?? '?'}%
            {limit !== undefined ? ` · ${limit.kind} ${limit.percentUsed}% used` : ''}
            {fps > 0 ? ` · ${fps} fps` : ''}
          </Text>
        )}
        {view === 'bar' && usage !== null && (
          <Progress label="Context" value={(usage.contextPercent ?? 0) / 100} />
        )}
      </Box>
    )
  })

  // Nhịp tick của mascot báo về đây; ta đo giờ thật để ra số khung hình mỗi giây.
  let last: { ticks: number; at: number } | null = null

  on('ui.message', async ($, e, next) => {
    const data = e.data as { ticks?: number } | null

    if (data !== null && typeof data.ticks === 'number') {
      const at = await $.clock.now()

      if (last !== null && data.ticks > last.ticks && at > last.at) {
        const fps = Math.round(((data.ticks - last.ticks) / ((at - last.at) / 1000)) * 10) / 10

        if (fps !== (await read($, fpsAtom))) {
          await update($, fpsAtom, () => fps)
          await note($, 'anim', `nhịp Client đo được ${fps} khung/giây (tick ${await read($, tickMsAtom)} ms)`)
        }
      }
      last = { ticks: data.ticks, at }
    }

    return next(e)
  })
}
