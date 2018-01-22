export default tagName => {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tagName)

  return node
}
