import _ from '_'
import playIcon from '../icons/play'
import pauseIcon from '../icons/pause'

export const $play = playIcon({
  class: 'icon',
})

export const $pause = pauseIcon({
  class: 'icon',
})

export const $playback = _({
  class: 'playback',
})

export const $mainPlayer = _({
  class: 'main-player',
  append: [$playback],
})
