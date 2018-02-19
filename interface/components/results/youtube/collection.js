import _collection from '_/collection' // eslint-disable-line
import _attributes from '_/attributes' // eslint-disable-line
import _text from '_/text' // eslint-disable-line
import _append from '_/append' // eslint-disable-line
import _remove from '_/remove' // eslint-disable-line
import _animateCoords from '_/animate-coords' // eslint-disable-line
import _animateStyle from '_/animate-style' // eslint-disable-line
import _classAdd from '_/class-add' // eslint-disable-line
import _classRemove from '_/class-remove' // eslint-disable-line
import { $youtubeSongs } from './elements'
import * as clone from '../cloners'
import { width, itemHeight, animationDuration } from '../settings'
import separators from './separators'
import createPlayer from '../../video-player'
import createProgress from '../../progress'

const fadeIn = $element =>
  _animateStyle($element, { duration: animationDuration }, { opacity: 0 }, { opacity: 1 })

const fadeOut = ($element, callback) =>
  _animateStyle($element, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 }, callback)

const collection = _collection($youtubeSongs, {
  create: i => {
    const player = createPlayer()

    const createPlay = () => clone.play({
      events: {
        click: () => player.emit('PLAY'),
        mouseenter: () => player.emit('PLAYBACK_HOVER'),
        mouseleave: () => player.emit('PLAYBACK_HOVER_ENDED'),
      },
    })

    const createPause = () => clone.pause({
      events: {
        click: () => player.emit('PAUSE'),
        mouseenter: () => player.emit('PLAYBACK_HOVER'),
        mouseleave: () => player.emit('PLAYBACK_HOVER_ENDED'),
      },
    })

    let $playbackIcon = createPlay()

    player.on({
      PLAYBACK_HOVER: () => _classAdd($playback, 'hover'),
      PLAYBACK_HOVER_ENDED: () => _classRemove($playback, 'hover'),
      PLAY: () => {
        fadeOut($playbackIcon, $element => _remove($element))

        $playbackIcon = createPause()

        fadeIn($playbackIcon)
        _append($playback, $playbackIcon)
      },
      PAUSE: () => {
        fadeOut($playbackIcon, $element => _remove($element))

        $playbackIcon = createPlay()

        fadeIn($playbackIcon)
        _append($playback, $playbackIcon)
      },
      DURATION_CHANGED: () => {
        progress.setDuration(player.state.duration)
      },
      CURRENT_TIME_CHANGED: () => {
        progress.setCurrentTime(player.state.currentTime)
      },
    })

    const $playback = clone.playback({ append: $playbackIcon })
    const $title = clone.title()

    const progress = createProgress({
      width,
      time: {
        minutes: 2,
        seconds: 31,
      },
    })

    const $info = clone.info({
      append: [$playback, $title, progress.$progress],
    })
    const $content = clone.content({
      append: [player.$player, $info],
    })
    const $item = clone.item({
      coords: { top: i * itemHeight },
      animateStyle: [{ duration: animationDuration }, { opacity: 0 }, { opacity: 1 }],
      append: $content,
    })

    return {
      $item,
      $title,
      player,
    }
  },
  update: {
    thumbnailUrl: ({ player }, thumbnailUrl) => player.emit('SET_THUMBNAIL', thumbnailUrl),
    id: ({ player }, id) => player.emit('SET_SOURCE', `http://localhost:3001/youtube/mp3/${id}`),
    // videoState: async ({ $video }, videoState) => {},
    title: ({ $title }, title) => _text($title, title),
  },
  move: ({ $item }, { previousIndex, nextIndex }) =>
    _animateCoords($item, { duration: animationDuration }, { top: previousIndex * itemHeight }, { top: nextIndex * itemHeight }),
  remove: async ({ $item }) => await _animateStyle($item, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 }),
})

collection.on(separators)

export default collection
