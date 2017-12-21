export default node => {
  if (!Array.isArray(node)) return node.cloneNode()

  return node.map(n => n.cloneNode())
}
