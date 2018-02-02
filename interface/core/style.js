import assign_ from '__/assign' // eslint-disable-line

export default (node, style) => {
  assign_(node.style, style)

  return node
}
