import _cloner from '_/cloner'
import { $play, $pause } from './elements'

export const container = _cloner()

export const list = _cloner({
  el: 'ul',
  class: 'list',
})

export const item = _cloner({
  el: 'li',
  class: 'item',
  style: { opacity: 0 },
})

export const content = _cloner({
  class: 'content',
})

export const info = _cloner({
  class: 'info',
})

export const playback = _cloner({
  class: 'playback',
}, true)

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

export const separators = _cloner({
  el: 'ul',
  class: 'separators',
})

export const separator = _cloner({
  el: 'li',
  class: 'separator',
})

export const scroll = _cloner({
  class: 'scroll',
})
