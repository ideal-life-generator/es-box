import _cloner from '_/cloner' // eslint-disable-line
import { $play, $pause } from './elements'

export const clonePlayer = _cloner({
  class: 'player',
})

export const cloneVideo = _cloner({
  el: 'video',
  class: 'video',
  attributes: {
    // autoplay: true,
    controlslist: 'nodownload',
  },
})

export const cloneSource = _cloner({
  el: 'source',
  class: 'source',
  attributes: { type: 'video/mp4' },
})

export const cloneMainButton = _cloner({
  class: 'main-button',
})

export const clonePlay = _cloner({
  node: $play,
}, true)

export const clonePause = _cloner({
  node: $pause,
}, true)
