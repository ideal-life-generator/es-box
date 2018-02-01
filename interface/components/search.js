import _ from 'core' // eslint-disable-line
import attributes_ from 'core/attributes' // eslint-disable-line
import animateStyle_ from 'core/animate-style' // eslint-disable-line
import append_ from 'core/append' // eslint-disable-line
import remove_ from 'core/remove' // eslint-disable-line
import assign_ from 'core/assign' // eslint-disable-line
import * as coords from '../helpers/search/coords'
import { searchChange, onClear } from '../helpers/search/caster'
import cloneClearIcon from '../helpers/clear-icon'
import '../styles/search.sass'

export const $clear = _({
  el: 'button',
  coords: coords.clear,
  classes: 'clear',
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
  classes: 'input',
  events: {
    input: ({ target: { value } }) => searchChange(value),
  },
  placeholder: 'Search',
})

export const $text = _({
  el: 'span',
  coords: coords.text,
  classes: 'text',
})

export const $field = _({
  coords: coords.field,
  classes: 'field',
  append: [$text, $input],
})

const $search = _({
  coords: coords.search,
  classes: 'search',
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
