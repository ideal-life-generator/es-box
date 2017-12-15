const append = require('./append')

module.exports = function createElement(tagName, options, $children) {
  const $element = document.createElementNS('http://www.w3.org/2000/svg', tagName)

  if (options) Object.assign($element, options)

  if ($children) append($element, $children)

  return $element
}
