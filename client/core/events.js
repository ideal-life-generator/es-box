module.exports = function events($element, map) {
  Object.keys(map).forEach(name => $element.addEventListener(name, map[name]))

  return $element
}
