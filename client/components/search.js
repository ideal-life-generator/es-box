import $ from 'core' // eslint-disable-line
import { search, input, clear, clearIcon } from '../params/search' // eslint-disable-line
import $clearIcon from './icons/clear'
import '../styles/search.sass'

export const $clear = $({
  element: 'button',
  params: clear,
  classes: 'clear',
  append: $clearIcon({
    params: clearIcon,
  }).$svg,
})

export const $input = $({
  element: 'input',
  params: input,
  classes: 'input',
  events: {
    input: e => {
      console.log(e.target.value)
    },
  },
  placeholder: 'Search',
})

export default $({
  params: search,
  classes: 'search',
  style: {
    borderRadius: `${search.height / 2}px`,
  },
  append: [$input, $clear],
})
