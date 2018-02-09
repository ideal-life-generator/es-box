import _state from '__/state' // eslint-disable-line
import _normalizeKey from '__/normalize-key' // eslint-disable-line
import _delay from '__/delay' // eslint-disable-line
import { fetchItemsRecalculateResize } from '../results/youtube/state'

const state = _state({
  value: '',
  normalizedValue: '',
  clear: false,
})

const fetchItemsRecalculateResizeDelay = _delay(fetchItemsRecalculateResize, 500)

export const setValue = (value, force) => {
  state.value = value
  state.normalizedValue = _normalizeKey(value)

  if (value && !state.clear) {
    state.clear = true

    state.emit('UPDATE_CLEAR')
  } else if (!value && state.clear) {
    state.clear = false

    state.emit('UPDATE_CLEAR')
  }

  if (force) {
    fetchItemsRecalculateResize()
  } else {
    fetchItemsRecalculateResizeDelay()
  }
}

export default state
