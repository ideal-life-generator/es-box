import _cloner from '_/cloner' // eslint-disable-line
import { $play, $pause } from './elements'

export const container = _cloner()

export const list = _cloner({
  el: 'ul',
  class: 'list',
})

export const item = _cloner({
  el: 'li',
  style: { opacity: 0 },
})

export const content = _cloner({
  el: 'div',
  class: 'content',
})

export const play = _cloner({
  node: $play,
}, true)

export const pause = _cloner({
  node: $pause,
}, true)

export const title = _cloner({
  el: 'p',
  class: 'title',
})

export const separators = _cloner({ el: 'ul' })

export const separator = _cloner({
  class: 'separator',
})

export const scroll = _cloner({
  class: 'scroll',
})
