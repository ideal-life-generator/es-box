export default function append_(node, children) {
  if (Array.isArray(children)) {
    children.map(c => append_(node, c))
  } else if (typeof children === 'string') {
    node.textContent = children
  } else {
    node.appendChild(children)
  }

  return node
}
