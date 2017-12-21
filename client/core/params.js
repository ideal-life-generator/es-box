import $style from './style'

export default (node, { x, y, width, height }) => $style(node, {
  position: 'absolute',
  left: typeof x === 'number' ? `${x}px` : null,
  top: typeof y === 'number' ? `${y}px` : null,
  width: typeof width === 'number' ? `${width}px` : null,
  height: typeof height === 'number' ? `${height}px` : null,
})
