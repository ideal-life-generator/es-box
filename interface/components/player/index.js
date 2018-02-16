import _animateStyle from '_/animate-style' // eslint-disable-line
import _events from '_/events' // eslint-disable-line
import _append from '_/append' // eslint-disable-line
import _remove from '_/remove' // eslint-disable-line
import { $mainIcon, $player } from './elements'
import { clonePlayIcon, clonePauseIcon } from './cloners'
import state, { play, pause } from './state'
import { animationDuration } from './settings'
import './index.sass'

const newPlayIcon = () => {
  const $playIcon = clonePlayIcon({
    events: {
      click: () => play($playIcon),
    },
  })

  return $playIcon
}

const newPauseIcon = () => {
  const $pauseIcon = clonePauseIcon({
    events: {
      click: () => pause($pauseIcon),
    },
  })

  return $pauseIcon
}

state.on({
  SHOW_PLAY: () => {
    const $playIcon = newPlayIcon()

    _append($mainIcon, $playIcon)

    _animateStyle($playIcon, { duration: animationDuration }, { opacity: 0 }, { opacity: 1 })
  },
  HIDE_PLAY: async $playIcon => {
    await _animateStyle($playIcon, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 })

    _remove($playIcon)
  },
  SHOW_PAUSE: () => {
    const $pauseIcon = newPauseIcon()

    _append($mainIcon, $pauseIcon)

    _animateStyle($pauseIcon, { duration: animationDuration }, { opacity: 0 }, { opacity: 1 })
  },
  HIDE_PAUSE: async $pauseIcon => {
    await _animateStyle($pauseIcon, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 })

    _remove($pauseIcon)
  },
})

_append($mainIcon, newPlayIcon())

export default $player
