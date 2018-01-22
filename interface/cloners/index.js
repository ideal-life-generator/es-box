import $cloner from 'core/cloner' // eslint-disable-line
import { list, item, title, separator } from '../params/results'

export const $list = $cloner({
  el: 'ul',
  params: list,
})

export const $item = $cloner({
  el: 'li',
  params: item,
  style: { opacity: 0 },
})

export const $title = $cloner({
  el: 'p',
  classes: 'title',
  params: title,
})

export const $separators = $cloner({
  el: 'ul',
  params: list,
})

export const $separator = $cloner({
  el: 'div',
  classes: 'separator',
  params: separator,
  style: { opacity: 0 },
})
