const { keys } = Object

export default (node, attributes) => {
  keys(attributes).forEach(name => node.setAttribute(name, attributes[name]))

  return node
}
