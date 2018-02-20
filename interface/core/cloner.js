import _ from '_'
import _clone from '_/clone'

export default (setup = {}, deep) => {
  const node = _(setup)

  return settings => _({
    node: _clone(node, deep),
    ...settings,
  })
}
