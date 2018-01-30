export default (node, events) => {
  Object.keys(events).forEach(name => node.removeEventListener(name, events[name]))

  return node
}
