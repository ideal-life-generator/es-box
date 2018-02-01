import _ from '_' // eslint-disable-line
import attributes_ from '_/attributes' // eslint-disable-line
import animateStyle_ from '_/animate-style' // eslint-disable-line
import append_ from '_/append' // eslint-disable-line
import remove_ from '_/remove' // eslint-disable-line
import assign_ from '_/assign' // eslint-disable-line
import * as coords from '../helpers/search/coords'
import { searchChange, onClear } from '../helpers/search/caster'
import cloneClearIcon from '../helpers/clear-icon'
import '../styles/search.sass'

export const $clear = _({
  el: 'button',
  coords: coords.clear,
  class: 'clear',
  append: cloneClearIcon({
    coords: coords.clearIcon,
  }),
  events: {
    click: () => onClear(),
  },
})

export const $input = _({
  el: 'input',
  coords: coords.input,
  class: 'input',
  events: {
    input: ({ target: { value } }) => searchChange(value),
  },
  placeholder: 'Search',
})

export const $text = _({
  el: 'span',
  coords: coords.text,
  class: 'text',
})

export const $field = _({
  coords: coords.field,
  class: 'field',
  append: [$text, $input],
})

const $search = _({
  coords: coords.search,
  class: 'search',
  style: {
    borderRadius: `${coords.search.height / 2}px`,
  },
  append: [$field],
})

const duration = 100

let include = false

const showClear = () => {
  if (!include) {
    append_($search, $clear)

    animateStyle_($clear, { duration }, { opacity: 0 }, { opacity: 1 })

    include = true
  }
}

const hideClear = async () => {
  if (include) {
    await animateStyle_($clear, { duration }, { opacity: 1 }, { opacity: 0 })

    remove_($clear)

    include = false
  }
}

searchChange(value => (value ? showClear() : hideClear()))

onClear(() => {
  assign_($input, { value: '' })

  searchChange('')

  hideClear()
})

export default $search
