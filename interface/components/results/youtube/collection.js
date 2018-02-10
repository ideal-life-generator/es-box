import _collection from '_/collection' // eslint-disable-line
import _attributes from '_/attributes' // eslint-disable-line
import _text from '_/text' // eslint-disable-line
import _animateCoords from '_/animate-coords' // eslint-disable-line
import _animateStyle from '_/animate-style' // eslint-disable-line
import { $youtubeSongs } from './elements'
import { item, thumbnail, title } from '../cloners'
import { itemHeight, animationDuration } from '../settings'
import separators from './separators'

const collection = _collection($youtubeSongs, {
  create: i => {
    const $title = title()
    const $thumbnail = thumbnail()

    return {
      $item: item({
        coords: { y: i * itemHeight },
        animateStyle: [{ duration: animationDuration }, { opacity: 0 }, { opacity: 1 }],
        append: [$thumbnail, $title],
      }),
      $thumbnail,
      $title,
    }
  },
  update: {
    thumbnailUrl: ({ $thumbnail }, value) => _attributes($thumbnail, { src: value }),
    title: ({ $title }, value) => _text($title, value),
  },
  move: ({ $item }, { previousIndex, nextIndex }) =>
    _animateCoords($item, { duration: animationDuration }, { y: previousIndex * itemHeight }, { y: nextIndex * itemHeight }),
  remove: async ({ $item }) => await _animateStyle($item, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 }),
})

collection.on(separators)

export default collection
