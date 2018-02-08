import _state from '__/state' // eslint-disable-line
import _normalizeKey from '__/normalize-key' // eslint-disable-line

export default _state({
  value: '',
  normalizedValue: '',
  clear: false,
}, {
  value: (state, { value }) => value && (state.normalizedValue = _normalizeKey(value)),
})
