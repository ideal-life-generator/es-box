import _ from '_' // eslint-disable-line
import _clone from '_/clone' // eslint-disable-line

export default (setup = {}, deep) => {
  const node = _(setup)

  return settings => _({
    node: _clone(node, deep),
    ...settings,
  })
}
