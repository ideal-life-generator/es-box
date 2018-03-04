import _ from '_'
import playIcon from '../icons/play'
import pauseIcon from '../icons/pause'
import state, { play, pause } from '../../state/main-player'
import { on } from '../../utils/subscriber'
import { toggleSwitchShowHide } from '../../utils/animations'
import './index.sass'

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

on({
  PLAY: () => toggleSwitchShowHidePlayPause(false),
  PAUSE: () => toggleSwitchShowHidePlayPause(true),
})
