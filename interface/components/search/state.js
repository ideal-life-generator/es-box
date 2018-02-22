import _state from '__/state'
import _normalizeKey from '__/normalize-key'
import _delay from '__/delay'
import { fetchItems } from '../results/youtube/state'

const state = {
  value: '',
  normalizedValue: 'black beatles',
  clear: false,
}

export default state

export const { emit, on } = _state(state)

const fetchItemsDelay = _delay(fetchItems, 500)

export const setValue = (value, force) => {
  state.value = value
  state.normalizedValue = _normalizeKey(value)

  window.history.pushState(null, state.value, state.normalizedValue)

  if (value && !state.clear) {
    state.clear = true

    emit('UPDATE_CLEAR')
  } else if (!value && state.clear) {
    state.clear = false

    emit('UPDATE_CLEAR')
  }

  if (force) {
    fetchItems()
  } else {
    fetchItemsDelay()
  }
}
