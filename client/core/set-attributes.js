module.exports = function setAttributes($element, attributes) {
  Object.keys(attributes).forEach(name => $element.setAttribute(name, attributes[name]))

  return $element
}
