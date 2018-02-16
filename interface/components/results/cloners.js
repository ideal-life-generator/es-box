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

export const player = _cloner({
  class: 'player',
})

export const video = _cloner({
  el: 'video',
  class: 'video',
  attributes: {
    // autoplay: true,
    controlslist: 'nodownload',
  },
})

export const source = _cloner({
  el: 'source',
  class: 'source',
  attributes: { type: 'video/mp4' },
})

export const mainButton = _cloner({
  class: 'main-button',
})

export const play = _cloner({
  node: $play,
}, true)

export const pause = _cloner({
  node: $pause,
}, true)

export const thumbnail = _cloner({
  el: 'img',
  class: 'thumbnail',
})

export const title = _cloner({
  el: 'p',
  class: 'title',
})

// <video controlslist="nodownload" src="blob:https://www.youtube.com/97af97d8-c957-4cd7-a4c4-2a1fe581397f" loop=""></video>


export const separators = _cloner({ el: 'ul' })

export const separator = _cloner({
  class: 'separator',
})

export const scroll = _cloner({
  class: 'scroll',
})
