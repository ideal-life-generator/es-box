import _state from '__/state' // eslint-disable-line
import _caster from '__/caster' // eslint-disable-line

const state = {
  value: '',
  normalizedValue: '',
  clear: false,
}

export default state

export const update = _state(state)
