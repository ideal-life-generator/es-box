import $ from 'core' // eslint-disable-line
import $attributes from 'core/attributes' // eslint-disable-line
import $animateStyle from 'core/animate-style' // eslint-disable-line
import $append from 'core/append' // eslint-disable-line
import $remove from 'core/remove' // eslint-disable-line
import {
  search,
  input,
  text,
  field,
  clear,
  clearIcon,
  searchChange,
} from '../settings/search'
import $clearIconﾟ from './icons/clear'
import '../styles/search.sass'

export const ﾟclear = $({
  el: 'button',
  params: clear,
  classes: 'clear',
  append: $clearIconﾟ({
    params: clearIcon,
  }),
  events: {
    click: () => searchChange('') || hideClear(),
  },
})

export const ﾟinput = $({
  el: 'input',
  params: input,
  classes: 'input',
  events: {
    input: ({ target: { value } }) => searchChange(value),
  },
  placeholder: 'Search',
})

searchChange(value => $attributes(ﾟinput, { value }))

export const ﾟtext = $({
  el: 'span',
  params: text,
  classes: 'text',
})

export const ﾟfield = $({
  params: field,
  classes: 'field',
  append: [ﾟtext, ﾟinput],
})

const ﾟsearch = $({
  params: search,
  classes: 'search',
  style: {
    borderRadius: `${search.height / 2}px`,
  },
  append: [ﾟfield],
})

const duration = 100

let include = false

const showClear = () => {
  if (!include) {
    $append(ﾟsearch, ﾟclear)

    $animateStyle(ﾟclear, { duration }, { opacity: 0 }, { opacity: 1 })

    include = true
  }
}

const hideClear = async () => {
  if (include) {
    await $animateStyle(ﾟclear, { duration }, { opacity: 1 }, { opacity: 0 })

    $remove(ﾟclear)

    include = false
  }
}

searchChange(value => {
  if (value) {
    showClear()
  } else {
    hideClear()
  }
})

export default ﾟsearch
