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
import { itemHeight, animationDuration } from '../settings'
import separators from './separators'
import createPlayer from '../../create-video-player'

const collection = _collection($youtubeSongs, {
  create: i => {
    const player = createPlayer()

    player.on({
      PLAYBACK_HOVER: () => _classAdd($playback, 'hover'),
      PLAYBACK_HOVER_ENDED: () => _classRemove($playback, 'hover'),
      PLAY: () => {
        _animateStyle($playbackIcon, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 }, $element => _remove($element))

        $playbackIcon = clone.pause({
          events: {
            click: () => player.emit('PAUSE'),
            mouseenter: () => player.emit('PLAYBACK_HOVER'),
            mouseleave: () => player.emit('PLAYBACK_HOVER_ENDED'),
          },
        })

        _animateStyle($playbackIcon, { duration: animationDuration }, { opacity: 0 }, { opacity: 1 })
        _append($playback, $playbackIcon)
      },
      PAUSE: () => {
        _animateStyle($playbackIcon, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 }, $element => _remove($element))

        $playbackIcon = clone.play({
          events: {
            click: () => player.emit('PLAY'),
            mouseenter: () => player.emit('PLAYBACK_HOVER'),
            mouseleave: () => player.emit('PLAYBACK_HOVER_ENDED'),
          },
        })

        _animateStyle($playbackIcon, { duration: animationDuration }, { opacity: 0 }, { opacity: 1 })
        _append($playback, $playbackIcon)
      },
    })

    let $playbackIcon = clone.play({
      events: {
        click: () => player.emit('PLAY'),
        mouseenter: () => player.emit('PLAYBACK_HOVER'),
        mouseleave: () => player.emit('PLAYBACK_HOVER_ENDED'),
      },
    })
    const $playback = clone.playback({ append: $playbackIcon })
    const $title = clone.title()
    const $progress = clone.progress()
    const $content = clone.content({
      append: [$playback, $title, $progress],
    })

    return {
      $item: clone.item({
        coords: { y: i * itemHeight },
        animateStyle: [{ duration: animationDuration }, { opacity: 0 }, { opacity: 1 }],
        append: [player.$player, $content],
      }),
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
    _animateCoords($item, { duration: animationDuration }, { y: previousIndex * itemHeight }, { y: nextIndex * itemHeight }),
  remove: async ({ $item }) => await _animateStyle($item, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 }),
})

collection.on(separators)

export default collection
