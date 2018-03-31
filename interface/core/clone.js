export default function clone_(node, deep) {
  if (Array.isArray(node)) {
    return node.map((n) => clone_(n, deep))
  }

  return node.cloneNode(deep)
}
