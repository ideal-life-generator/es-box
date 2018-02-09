import assign_ from '__/assign' // eslint-disable-line

const { stringify } = JSON

export default (node, style) => {
  if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
    throw new Error(`Cannot set ${stringify(style)}, because ${node} is not instance of HTMLElement`)
  }

  assign_(node.style, style)

  return node
}
