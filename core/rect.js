export default (node) => {
  const { width, height } = node.getBoundingClientRect()

  return [width, height]
}
