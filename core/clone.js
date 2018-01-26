export default (node, deep) => {
  if (!Array.isArray(node)) return node.cloneNode(deep)

  return node.map(n => n.cloneNode())
}
