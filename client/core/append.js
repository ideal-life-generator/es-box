export default function $(node, children) {
  if (Array.isArray(children)) {
    children.map($children => $(node, $children))
  } else if (typeof children === 'string') {
    node.textContent = children
  } else {
    node.appendChild(children)
  }

  return node
}
