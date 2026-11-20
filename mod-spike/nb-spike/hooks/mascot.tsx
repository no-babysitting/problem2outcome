// Mô-đun bề mặt (chạy trong vùng Client, không có `$`): mascot ASCII động.
//
// Đây là phần "hoạt ảnh bằng Client" của phép thử 2. Mô-đun tự chạy nhịp bằng surface.every,
// và cứ mỗi ~1 giây báo số tick về cho hook qua surface.post; hook đo giờ thật bằng $.clock
// để tính ra số khung hình mỗi giây mà Desktop thực sự cho vẽ.
import type { ClientModule } from 'claude-code'

export type MascotProps = {
  line: string
  mood: 'calm' | 'busy' | 'tired'
  tickMs: number
  show: boolean
}

type State = { ticks: number; blink: boolean; cancel?: () => void }

const FACES: Record<MascotProps['mood'], [string, string]> = {
  calm: ['(^_^)', '(-_-)'],
  busy: ['(o_o)', '(-_-)'],
  tired: ['(-_-)', '(-_-)zz'],
}

const Mascot: ClientModule<MascotProps, State> = (props, s) => {
  const { Box, Text } = s.elements
  const perReport = Math.max(1, Math.round(1000 / props.tickMs))

  if (s.state === undefined) {
    const initial: State = { ticks: 0, blink: false }

    s.setState(initial)
    // Chỉ bật nhịp một lần, khi state còn trống (xem ClientSurface.every).
    s.every(props.tickMs, () => {
      const now = s.state ?? initial
      const ticks = now.ticks + 1

      s.setState({ ticks, blink: Math.floor(ticks / 8) % 6 === 0 ? !now.blink : now.blink })

      if (ticks % perReport === 0) {
        s.post({ ticks })
      }
    })
  }

  const st = s.state ?? { ticks: 0, blink: false }
  const [open, shut] = FACES[props.mood]
  const face = st.blink ? shut : open
  // Một vệt nhỏ chạy ngang để thấy chuyển động mượt hay giật.
  const pos = st.ticks % 12
  const track = '.'.repeat(pos) + '*' + '.'.repeat(11 - pos)

  return (
    <Box flexDirection="column">
      <Text>
        {face} {track}
      </Text>
      {props.show && props.line !== '' && <Text dimColor>{props.line}</Text>}
    </Box>
  )
}

export default Mascot
