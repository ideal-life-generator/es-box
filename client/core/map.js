export default ({ create, update }) => {
  const nodes = {}

  return items => {
    items.forEach(item => {
      const { [item.id]: node } = nodes
      if (node) update(node, item)
      else nodes[item.id] = create(item)
    })
  }
}
