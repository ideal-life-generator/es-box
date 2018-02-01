const { isArray } = Array

export default function before_(node, referenceNode) {
  if (isArray(node)) {
    node.map(n => before_(n, referenceNode))
  } else {
    referenceNode.parentNode.insertBefore(node, referenceNode)
  }

  return node
}
