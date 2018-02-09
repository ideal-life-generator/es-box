import _ from '_' // eslint-disable-line
import _animateStyle from '_/animate-style' // eslint-disable-line
import _append from '_/append' // eslint-disable-line
import _remove from '_/remove' // eslint-disable-line
import _assign from '__/assign' // eslint-disable-line
import _delay from '__/delay' // eslint-disable-line
import cloneClearIcon from '../../helpers/clear-icon'

export const $clear = _({
  el: 'button',
  class: 'clear',
  append: cloneClearIcon(),
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
