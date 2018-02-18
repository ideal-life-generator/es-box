import _state from '__/state' // eslint-disable-line
import _normalizeKey from '__/normalize-key' // eslint-disable-line
import _delay from '__/delay' // eslint-disable-line
import { fetchItems } from '../results/youtube/state'

const state = {
  value: '',
  normalizedValue: 'One Punch Man - BATTLE!! (Extended)',
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
