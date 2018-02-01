import $cloner from 'core/cloner' // eslint-disable-line
import * as coords from './coords'

export const container = $cloner({
  coords: coords.container,
})

export const list = $cloner({
  el: 'ul',
  classes: 'list',
  coords: coords.list,
})

export const item = $cloner({
  el: 'li',
  coords: coords.item,
  style: { opacity: 0 },
})

export const title = $cloner({
  el: 'p',
  classes: 'title',
  coords: coords.title,
})

export const separators = $cloner({
  el: 'ul',
  coords: coords.separators,
})

export const separator = $cloner({
  classes: 'separator',
  coords: coords.separator,
  style: { opacity: 0 },
})

export const scroll = $cloner({
  coords: coords.scroll,
  classes: 'scroll',
})
