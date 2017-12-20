module.exports = function append($element, children) {
  if (Array.isArray(children)) {
    children.map($children => append($element, $children))
  } else if (typeof children === 'string') {
    $element.textContent = children
  } else {
    $element.appendChild(children)
  }

  return $element
}
