const { keys } = Object

export default (node, events) => {
  keys(events).forEach(name => node.addEventListener(name, events[name]))

  return node
}
