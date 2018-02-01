import assign from '../../_/assign'

export default (node, style) => {
  assign(node.style, style)

  return node
}
