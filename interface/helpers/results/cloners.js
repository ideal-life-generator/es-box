import cloner_ from '_/cloner' // eslint-disable-line
import * as coords from './coords'

export const container = cloner_({
  coords: coords.container,
})

export const list = cloner_({
  el: 'ul',
  class: 'list',
  coords: coords.list,
})

export const item = cloner_({
  el: 'li',
  coords: coords.item,
  style: { opacity: 0 },
})

export const title = cloner_({
  el: 'p',
  class: 'title',
  coords: coords.title,
})

export const separators = cloner_({
  el: 'ul',
  coords: coords.separators,
})

export const separator = cloner_({
  class: 'separator',
  coords: coords.separator,
  style: { opacity: 0 },
})

export const scroll = cloner_({
  coords: coords.scroll,
  class: 'scroll',
})
