import _ from '_'
import _animateStyle from '_/animate-style'
import _append from '_/append'
import _remove from '_/remove'
import _assign from '__/assign'
import _delay from '__/delay'
import clearIcon from '../icons/clear'

export const $clear = _({
  el: 'button',
  class: 'clear',
  append: clearIcon(),
})

export const $input = _({
  el: 'input',
  class: 'input',
  placeholder: 'Search',
})

export const $search = _({
  class: 'search',
  append: [$input],
})
