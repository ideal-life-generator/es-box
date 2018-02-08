import _collection from '_/collection' // eslint-disable-line
import _text from '_/text' // eslint-disable-line
import _animateCoords from '_/animate-coords' // eslint-disable-line
import _animateStyle from '_/animate-style' // eslint-disable-line
import { $youtubeSongs } from './elements'
import { item, title } from '../cloners'
import { itemHeight, animationDuration } from '../settings'
import separators from './separators'

const collection = _collection($youtubeSongs, {
  create: i => {
    const $title = title()

    return {
      $item: item({
        append: $title,
        coords: { y: i * itemHeight },
        animateStyle: [{ duration: animationDuration }, { opacity: 0 }, { opacity: 1 }],
      }),
      $title,
    }
  },
  update: { title: ({ $title }, t) => _text($title, t) },
  move: ({ $item }, { previousIndex, nextIndex }) =>
    _animateCoords($item, { duration: animationDuration }, { y: previousIndex * itemHeight }, { y: nextIndex * itemHeight }),
  remove: async ({ $item }) => await _animateStyle($item, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 }),
})

collection.on(separators)

export default collection
