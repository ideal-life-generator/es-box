import _append from '_/append' // eslint-disable-line
import _remove from '_/remove' // eslint-disable-line
import _attributes from '_/attributes' // eslint-disable-line
import _animateStyle from '_/animate-style' // eslint-disable-line
import {
  clonePlayer,
  cloneMainButton,
  clonePlay,
  clonePause,
  cloneVideo,
  // cloneThumbnail,
  cloneSource,
} from './cloners'
import createState from './create-state'
import { animationDuration } from './settings'

export default () => {
  const { state, emit, on } = createState()

  const $source = cloneSource()
  let $play = clonePlay({
    events: {
      click: () => emit('PLAY'),
      // click: () => state.emit('CHANGE_VIDEO_STATE', item, 'PLAY'),
    },
  })
  let $pause
  const $mainButton = cloneMainButton({ append: $play })
  // const $thumbnail = cloneThumbnail()
  const $video = cloneVideo({ append: $source })
  const $player = clonePlayer({
    append: [$video, $mainButton],
  })

  on({
    PLAY: () => {
      $video.play()

      _animateStyle($play, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 }, $el => _remove($el))
      $play = null

      $pause = clonePause({
        events: {
          click: () => emit('PAUSE'),
        },
      })
      _animateStyle($pause, { duration: animationDuration }, { opacity: 0 }, { opacity: 1 })
      _append($mainButton, $pause)
    },
    PAUSE: () => {
      $video.pause()

      _animateStyle($pause, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 }, $el => _remove($el))
      $pause = null

      $play = clonePlay({
        events: {
          click: () => emit('PLAY'),
        },
      })
      _animateStyle($play, { duration: animationDuration }, { opacity: 0 }, { opacity: 1 })
      _append($mainButton, $play)
    },
    SET_SOURCE: source => _attributes($source, { src: source }),
  })

  return { $player, state, emit, on }
}
