import _ from '_'
import Subscriber from '__/subscriber'
import _assign from '__/assign'
import _normalizeKey from '__/normalize-key'
import _delay from '__/delay'
import clearIcon from '../icons/clear'
import { toggleShowHide } from '../../utils/animations'
// import { fetchItems } from '../results/youtube'
import './index.sass'

const fetchItems = () => {}

export const state = {
  value: '',
  normalizedValue: 'starboy',
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

export const $clear = _({
  el: 'button',
  class: 'clear',
  append: clearIcon(),
  events: {
    click: () => {
      _assign($input, { value: '' })

      setValue('', true)
    },
  },
})

export const $input = _({
  el: 'input',
  class: 'input',
  placeholder: 'Search',
  events: {
    input: ({ target: { value } }) => setValue(value),
  },
})

export const $search = _({
  class: 'search',
  append: [$input, $clear],
})

export const toggleShowHideClear = toggleShowHide($clear)

export const { emit, on } = new Subscriber({
  SHOW_CLEAR: () => toggleShowHideClear(true),
  HIDE_CLEAR: () => toggleShowHideClear(false),
})
