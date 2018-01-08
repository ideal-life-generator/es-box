export default function _(node, referenceNode) {
  if (!Array.isArray(node)) {
    referenceNode.parentNode.insertBefore(referenceNode, node)
  } else {
    node.map(n => _(referenceNode, n))
  }

  return node
}
