import _collection from '_/collection' // eslint-disable-line
import _attributes from '_/attributes' // eslint-disable-line
import _text from '_/text' // eslint-disable-line
import _append from '_/append' // eslint-disable-line
import _remove from '_/remove' // eslint-disable-line
import _animateCoords from '_/animate-coords' // eslint-disable-line
import _animateStyle from '_/animate-style' // eslint-disable-line
import { $youtubeSongs } from './elements'
import * as clone from '../cloners'
import { itemHeight, animationDuration } from '../settings'
import separators from './separators'
import createPlayer from '../../create-video-player'

const collection = _collection($youtubeSongs, {
  create: i => {
    const { $player, emit } = createPlayer()
    const $play = clone.play()
    const $title = clone.title()
    const $content = clone.content({
      append: [$play, $title],
    })

    return {
      $item: clone.item({
        coords: { y: i * itemHeight },
        animateStyle: [{ duration: animationDuration }, { opacity: 0 }, { opacity: 1 }],
        append: [$player, $content],
      }),
      $title,
      player: { emit },
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
