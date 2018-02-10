import cloner_ from '_/cloner' // eslint-disable-line

export const container = cloner_({})

export const list = cloner_({
  el: 'ul',
  class: 'list',
})

export const item = cloner_({
  el: 'li',
  style: { opacity: 0 },
})

export const thumbnail = cloner_({
  el: 'img',
  class: 'thumbnail',
})

export const title = cloner_({
  el: 'p',
  class: 'title',
})

export const separators = cloner_({ el: 'ul' })

export const separator = cloner_({
  class: 'separator',
})

export const scroll = cloner_({
  class: 'scroll',
})
