module.exports = function append($element, $children) {
  if (Array.isArray($children)) {
    $children.map($childrenElement => append($element, $childrenElement))
  } else if (typeof $children === 'string') {
    $element.textContent = $children
  } else {
    $element.appendChild($children)
  }

  return $element
}
