module.exports = function position($element, { top, left, right, bottom }) {
  $element.style.position = 'absolute'

  if (typeof top === 'number') $element.style.top = `${top}px`
  if (typeof left === 'number') $element.style.left = `${left}px`
  if (typeof right === 'number') $element.style.right = `${right}px`
  if (typeof bottom === 'number') $element.style.bottom = `${bottom}px`
}
