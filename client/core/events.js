export default (node, events) => {
  Object.keys(events).forEach(name => node.addEventListener(name, events[name]))

  return node
}
