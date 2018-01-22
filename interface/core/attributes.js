export default (node, attributes) => {
  Object.keys(attributes).forEach(name => node.setAttribute(name, attributes[name]))

  return node
}
