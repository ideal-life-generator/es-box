module.exports = function createElement(tagName, options, $children) {
  const $element = document.createElement(tagName)

  if (options) Object.assign($element, options)

  if ($children) {
    if (Array.isArray($children)) {
      $children.map($childrenElement => $element.appendChild($childrenElement))
    } else {
      $element.appendChild($children)
    }
  }

  return $element
}
