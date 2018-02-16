import _ from '_' // eslint-disable-line
import _clone from '_/clone' // eslint-disable-line
import _assign from '__/assign' // eslint-disable-line

const resolveSetup = ({ node, ...setup }, deep) => {
  const resolvedSetup = {}

  if (node) {
    resolvedSetup.node = _clone(node, deep)
  }

  return {
    ...setup,
    ...resolvedSetup,
  }
}

export default (setup = {}, deep) => settings => {
  const resolvedSetup = resolveSetup(setup, deep)
  const node = _(resolvedSetup)

  return _({
    node,
    ...settings,
  })
}
