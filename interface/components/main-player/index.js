import _animateStyle from '_/animate-style'
import _events from '_/events'
import _append from '_/append'
import _remove from '_/remove'
import { $playback, $mainPlayer } from './elements'
import * as clone from './cloners'
import { on, play, pause } from './state'
import { animationDuration } from './settings'
import './index.sass'

let $playbackIcon = clone.play({
  events: {
    click: () => play(),
  },
})

_append($playback, $playbackIcon)

on({
  SHOW_PLAY: () => {
    _animateStyle($playbackIcon, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 }, $element => _remove($element))

    $playbackIcon = clone.play({
      events: {
        click: () => play(),
      },
    })

    _append($playback, $playbackIcon)

    _animateStyle($playbackIcon, { duration: animationDuration }, { opacity: 0 }, { opacity: 1 })
  },
  SHOW_PAUSE: () => {
    _animateStyle($playbackIcon, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 }, $element => _remove($element))

    $playbackIcon = clone.pause({
      events: {
        click: () => pause(),
      },
    })

    _append($playback, $playbackIcon)

    _animateStyle($playbackIcon, { duration: animationDuration }, { opacity: 0 }, { opacity: 1 })
  },
})

export default $mainPlayer
