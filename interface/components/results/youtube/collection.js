import _collection from '_/collection' // eslint-disable-line
import _attributes from '_/attributes' // eslint-disable-line
import _text from '_/text' // eslint-disable-line
import _append from '_/append' // eslint-disable-line
import _remove from '_/remove' // eslint-disable-line
import _animateCoords from '_/animate-coords' // eslint-disable-line
import _animateStyle from '_/animate-style' // eslint-disable-line
import { $youtubeSongs } from './elements'
import { cloneItem, cloneTitle } from '../cloners'
import { itemHeight, animationDuration } from '../settings'
import separators from './separators'
import createPlayer from '../../create-video-player'

const collection = _collection($youtubeSongs, {
  create: i => {
    const { $player, emit } = createPlayer()
    const $title = cloneTitle()

    return {
      $item: cloneItem({
        coords: { y: i * itemHeight },
        animateStyle: [{ duration: animationDuration }, { opacity: 0 }, { opacity: 1 }],
        append: [$player, $title],
      }),
      $title,
      player: { emit },
    }
  },
  update: {
    id: ({ player: { emit } }, id) => emit('SET_SOURCE', `http://localhost:3001/youtube/mp3/${id}`),
    // videoState: async ({ $video }, videoState) => {},
    // thumbnail: ({ $thumbnail }, thumbnail) => _attributes($thumbnail, { src: thumbnail }),
    title: ({ $title }, title) => _text($title, title),
  },
  move: ({ $item }, { previousIndex, nextIndex }) =>
    _animateCoords($item, { duration: animationDuration }, { y: previousIndex * itemHeight }, { y: nextIndex * itemHeight }),
  remove: async ({ $item }) => await _animateStyle($item, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 }),
})

collection.on(separators)

export default collection
