export default function _(node, children) {
  if (Array.isArray(children)) {
    children.map($children => _(node, $children))
  } else if (typeof children === 'string') {
    node.textContent = children
  } else {
    node.appendChild(children)
  }

  return node
}
