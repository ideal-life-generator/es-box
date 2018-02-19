export default function _append(node, children) {
  if (Array.isArray(children)) {
    children.map(c => _append(node, c))
  } else if (typeof children === 'string') {
    node.textContent = children
  } else {
    try {
      node.appendChild(children)
    } catch (error) {
      throw new Error(`${children} append in ${node}`)
    }
  }

  return node
}
