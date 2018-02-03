import deepAssign from 'deep-assign'
import _caster from '__/caster' // eslint-disable-line

export default state => {
  const { update } = _caster('update')

  return data => {
    if (typeof data !== 'function') {
      deepAssign(state, data)
    }

    update(data)
  }
}
