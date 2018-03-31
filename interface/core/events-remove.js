const { keys } = Object

export default (node, events) => {
  keys(events).forEach((name) => node.removeEventListener(name, events[name]))

  return node
}
