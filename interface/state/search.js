import _normalizeKey from '__/normalize-key'
import _delay from '__/delay'
import { fetchItems } from './results/youtube'
import { emit } from '../utils/subscriber'

const state = {
  value: '',
  normalizedValue: 'One Punch Man - BATTLE!! (Extended)',
  clear: false,
}

export const fetchItemsDelay = _delay(fetchItems, 500)

export const setValue = (value, force) => {
  const { clear } = state

  state.value = value
  state.normalizedValue = _normalizeKey(value)

  if (value && !clear) {
    state.clear = true

    emit('SHOW_CLEAR')
  } else if (!value && clear) {
    state.clear = false

    emit('HIDE_CLEAR')
  }

  if (force) {
    fetchItems()
  } else {
    fetchItemsDelay()
  }
}

export default state
