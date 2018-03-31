const { keys } = Object

export default function _events(node, events) {
  if (typeof events === 'object') {
    keys(events).forEach((name) => node.addEventListener(name, events[name]))
  } else if (typeof events === 'function') {
    _events(node, events(node))
  } else {
    throw new Error(
      'Second agrument should be an events map or a function what return it'
    )
  }

  return node
}
