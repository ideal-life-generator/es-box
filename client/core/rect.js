module.exports = function rect($element) {
  const { width, height } = $element.getBoundingClientRect()

  return [width, height]
}
