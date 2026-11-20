// Nền SVG của phép thử 2. Chuyển động bằng CSS trong thẻ <style> của chính SVG (không script, không tải gì từ ngoài).
// Màu đổi theo mức context để thử "nền đổi theo trạng thái phiên" (D5): xanh -> hổ phách -> đỏ thẫm.
export const SCENE_NAME = 'nb-spike'

export const sceneFor = (contextPercent: number | null): string => {
  const p = contextPercent ?? 0
  const hue = p < 50 ? 205 : p < 80 ? 35 : 5
  const speed = p < 50 ? 14 : p < 80 ? 9 : 5

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<style>
  .bg{fill:hsl(${hue} 45% 14%)}
  .orb{fill:hsl(${hue} 70% 55%);opacity:.22;animation:drift ${speed}s ease-in-out infinite alternate}
  .o2{animation-duration:${speed * 1.6}s;animation-delay:-3s}
  .o3{animation-duration:${speed * 2.2}s;animation-delay:-6s}
  @keyframes drift{from{transform:translate(0,0) scale(1)}to{transform:translate(120px,-60px) scale(1.18)}}
</style>
<rect class="bg" width="1600" height="900"/>
<circle class="orb" cx="300" cy="620" r="240"/>
<circle class="orb o2" cx="1050" cy="300" r="320"/>
<circle class="orb o3" cx="1400" cy="760" r="200"/>
</svg>`
}

export const sceneAlt = 'Quả cầu màu trôi chậm; màu đổi theo mức context của phiên.'
