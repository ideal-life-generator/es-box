module.exports = function size($element, [width, height]) {
  if (typeof width === 'number') $element.style.width = `${width}px`
  if (typeof height === 'number') $element.style.height = `${height}px`

  return $element
}
