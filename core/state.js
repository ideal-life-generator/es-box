import deepAssign from 'deep-assign'
import _caster from '__/caster' // eslint-disable-line

const { assign } = Object

export default state => {
  const { update } = _caster('update')

  return assign(state, {
    _update(...args) {
      const [data] = args

      if (typeof data !== 'function') {
        deepAssign(state, data)
      }

      update(data)
    },
  })
}
