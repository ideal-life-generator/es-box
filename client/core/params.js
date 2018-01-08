import $style from './style'

export default function _(node, params) {
  const { x, y, width, height } = params

  if (!Array.isArray(node)) {
    $style(node, {
      position: 'absolute',
      left: typeof x === 'number' ? `${x}px` : null,
      top: typeof y === 'number' ? `${y}px` : null,
      width: typeof width === 'number' ? `${width}px` : null,
      height: typeof height === 'number' ? `${height}px` : null,
    })
  } else node.forEach(n => _(n, params))
}
