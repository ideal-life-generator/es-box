import _ from '_'
import Subscriber from '__/subscriber'
import playIcon from '../icons/play'
import pauseIcon from '../icons/pause'
import { toggleSwitchShowHide } from '../../utils/animations'
import './index.sass'

export const state = {
  paused: true,
}

export const play = () => {
  state.paused = false

  emit('PLAY')
}

export const pause = () => {
  state.paused = true

  emit('PAUSE')
}

export const $play = playIcon({ class: 'icon' })
export const $pause = pauseIcon({ class: 'icon' })
export const $playback = _({
  class: 'playback',
  append: [$play, $pause],
  events: {
    click: () => {
      const { paused } = state

      if (paused) {
        play()
      } else {
        pause()
      }
    },
  },
})
export const $mainPlayer = _({ class: 'main-player', append: [$playback] })

export const toggleSwitchShowHidePlayPause = toggleSwitchShowHide($play, $pause)

export const { emit, on } = new Subscriber({
  PLAY: () => toggleSwitchShowHidePlayPause(false),
  PAUSE: () => toggleSwitchShowHidePlayPause(true),
})
