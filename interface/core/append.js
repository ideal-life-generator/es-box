export default function _append(node, children) {
  if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
    throw new Error(`Can't append ${children} to ${node}`)
  }

  if (Array.isArray(children)) {
    children.map(c => _append(node, c))
  } else if (typeof children === 'string') {
    node.textContent = children
  } else {
    node.appendChild(children)
  }

  return node
}
