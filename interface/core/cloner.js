import _ from '_' // eslint-disable-line
import clone_ from '_/clone' // eslint-disable-line

export default (setup, deep) => {
  const node = _(setup)

  return settings => _({
    node: clone_(node, deep),
    ...settings,
  })
}
