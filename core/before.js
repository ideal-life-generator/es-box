export default function _(node, referenceNode) {
  if (!Array.isArray(node)) {
    referenceNode.parentNode.insertBefore(node, referenceNode)
  } else {
    node.map(n => _(n, referenceNode))
  }

  return node
}
