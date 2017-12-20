const createElement = require('./create-element')
const position = require('./position')
const size = require('./size')
const append = require('./append')
const events = require('./events')

module.exports = function $(tagName, assign, params) {
  const $element = createElement(tagName)

  if (assign) {
    Object.assign($element, assign)

    if (assign.style) Object.assign($element.style, assign.style)
  }

  if (params.position) position($element, params.position)
  if (params.size) size($element, params.size)
  if (params.append) append($element, params.append)
  if (params.events) events($element, params.events)

  return $element
}
