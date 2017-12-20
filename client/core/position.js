module.exports = function position($element, [left, top]) {
  $element.style.position = 'absolute'

  if (typeof top === 'number') $element.style.top = `${top}px`
  if (typeof left === 'number') $element.style.left = `${left}px`

  return $element
}
