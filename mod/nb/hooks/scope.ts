// Scopes an SVG's own CSS to one root class, so a style inside the scene or the band can never reach
// the rest of the app (inline SVG styles apply to the whole document) and two SVGs never clash.
// Pure: our CSS only, so a small brace walker is enough.

export function scopeCSS(css: string, root: string): string {
  const names = [...css.matchAll(/@keyframes\s+([\w-]+)/g)].map(m => m[1] as string)
  let text = css

  for (const n of names) {
    text = text
      .replace(new RegExp(`@keyframes\\s+${n}\\b`, 'g'), `@keyframes ${root}-${n}`)
      .replace(new RegExp(`(animation:\\s*)${n}\\b`, 'g'), `$1${root}-${n}`)
  }

  const walk = (src: string): string => {
    let out = ''
    let i = 0

    while (i < src.length) {
      const open = src.indexOf('{', i)

      if (open < 0) {
        return out + src.slice(i)
      }
      const head = src.slice(i, open).trim()
      let depth = 1
      let j = open + 1

      while (j < src.length && depth > 0) {
        depth += src[j] === '{' ? 1 : src[j] === '}' ? -1 : 0
        j++
      }
      const body = src.slice(open + 1, j - 1)

      if (head.startsWith('@keyframes')) {
        out += `${head}{${body}}`
      } else if (head.startsWith('@')) {
        out += `${head}{${walk(body)}}`
      } else {
        const sel = head
          .split(',')
          .map(s => `.${root} ${s.trim()}`)
          .join(',')

        out += `${sel}{${body}}`
      }
      i = j
    }

    return out
  }

  return walk(text)
}
