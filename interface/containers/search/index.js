import _ from '_'
import _assign from '__/assign'
import clearIcon from '../../components/icons/clear'
import { setValue } from '../../state/search'
import { on } from '../../utils/subscriber'
import { toggleShowHide } from '../../utils/animations'
import './index.sass'

export const $clear = _({
  el: 'button',
  class: 'clear',
  append: clearIcon(),
  events: {
    click: () => {
      _assign($input, { value: '' })

      setValue('', true)
    }
  }
})

export const $input = _({
  el: 'input',
  class: 'input',
  placeholder: 'Search',
  events: {
    input: ({ target: { value } }) => setValue(value)
  }
})

export const $search = _({
  class: 'search',
  append: [$input, $clear]
})

export const toggleShowHideClear = toggleShowHide($clear)

on({
  SHOW_CLEAR: () => toggleShowHideClear(true),
  HIDE_CLEAR: () => toggleShowHideClear(false)
})
