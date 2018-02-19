import _append from '_/append' // eslint-disable-line
import _remove from '_/remove' // eslint-disable-line
import _attributes from '_/attributes' // eslint-disable-line
import _cloner from '_/cloner' // eslint-disable-line
import _animateStyle from '_/animate-style' // eslint-disable-line
import {
  clonePlayer,
  cloneThumbnail,
  cloneSource,
  cloneVideo,
  // cloneMainButton,
  // clonePlay,
  // clonePause,
} from './cloners'
import createState from './create-state'
// import { animationDuration } from './settings'
import './index.sass'

export default () => {
  const { state, emit, on } = createState()

  let $thumbnail = cloneThumbnail()
  // let $mainButton = cloneMainButton({
  //   events: {
  //     mouseenter: event => event.stopPropagation(),
  //     mouseleave: event => event.stopPropagation(),
  //   },
  //   // animateStyle: [{ duration: animationDuration }, { opacity: 0 }, { opacity: 1 }],
  // })
  // const ncloneMainButton = _cloner({
  //   node: $mainButton,
  // })
  const $source = cloneSource()
  const $video = cloneVideo({
    events: {
      play: () => {
        state.playback = 'PLAY'
      },
      pause: () => {
        state.playback = 'PAUSE'
      },
    },
    append: $source,
  })
  const $player = clonePlayer({
    events: {
      mouseenter: () => emit('PLAYBACK_HOVER'),
      mouseleave: () => emit('PLAYBACK_HOVER_ENDED'),
      click: () => {
        if ($video.paused) {
          emit('PLAY')
        } else {
          emit('PAUSE')
        }
      },
    },
    append: [$video, $thumbnail],
  })

  on({
    SET_THUMBNAIL: thumbnail => {
      _attributes($thumbnail, { src: thumbnail })
    },
    HIDE_THUMBNAIL: () => {
      _remove($thumbnail)

      $thumbnail = null
    },
    PLAY: () => {
      if ($thumbnail) {
        emit('HIDE_THUMBNAIL')
      }

      $video.play()


      // const $play = clonePlay()
      // $mainButton = ncloneMainButton({ append: $play })
      // _animateStyle($mainButton, { duration: 150 }, { opacity: 0 }, { opacity: 1 }, $element => {
      //   _animateStyle($element, { duration: 150 }, { opacity: 1 }, { opacity: 0 }, $selement => _remove($selement))
      // })
      // _append($player, $mainButton)
    },
    PAUSE: () => {
      $video.pause()

      // const $pause = clonePause()
      // $mainButton = ncloneMainButton({ append: $pause })
      // _animateStyle($mainButton, { duration: 150 }, { opacity: 0 }, { opacity: 1 }, $element => {
      //   _animateStyle($element, { duration: 150 }, { opacity: 1 }, { opacity: 0 }, $selement => _remove($selement))
      // })
      // _append($player, $mainButton)
    },
    SET_SOURCE: source => _attributes($source, { src: source }),
  })

  return { $player, state, emit, on }
}
