const append = require('./append')
const position = require('./position')

module.exports = function createElement(tagName, options, $children, params) {
  const $element = document.createElement(tagName)

  if (options) Object.assign($element, options)

  if ($children) append($element, $children)

  if (params) {
    if (params.position) position($element, params.position)
  }

  return $element
}
