import _state from '__/state' // eslint-disable-line
import _normalizeKey from '__/normalize-key' // eslint-disable-line
import _delay from '__/delay' // eslint-disable-line
import { fetchItems } from '../results/youtube/state'

const state = _state({
  value: '',
  normalizedValue: '',
  clear: false,
})

const fetchItemsDelay = _delay(fetchItems, 500)

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
    fetchItems()
  } else {
    fetchItemsDelay()
  }
}

export default state
