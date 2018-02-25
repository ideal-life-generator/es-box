import _ from '_'
import Subscriber from '__/subscriber'
import Collection from '_/collection'
import _coords from '_/coords'
import Item from './item'
import { moveTop, hide } from '../../../utils/animations'

export default class YoutubeSongs {
  state = {
    itemHeight: null,
  }

  // separators = new Separators({
  //   create: i => cloneSeparator({
  //     coords: { top: i * itemHeight },
  //     created: $element => show($element),
  //   }),
  //   remove: $separator => hide($separator),
  // })
  // yResizer = new YResizer($youtubeSongs, {
  //   y: {
  //     activator: $yResizer,
  //     count: state.resizerLength,
  //     min: state.resizerMin,
  //     max: state.resizerMax,
  //     size: itemHeight,
  //   },
  // })
  collection = new Collection({
    create: index => {
      const { itemHeight } = this

      const item = new Item({ index })

      _coords(item.$item, { top: index * itemHeight })

      return item
    },
    update: {
      id: (item, id) => item.setSource(`http://localhost:3001/youtube/mp3/${id}`),
      thumbnailUrl: (item, thumbnailUrl) => item.setThumbnail(thumbnailUrl),
      title: (item, title) => item.setTitle(title),
      duration: (item, duration) => item.setDuration(duration),
    },
    move: ({ $item }, { previousIndex, nextIndex }) => moveTop($item, previousIndex * this.itemHeight, nextIndex * this.itemHeight),
    remove: ({ $item }) => hide($item),
  })
  $youtubeSongs = _({ el: 'ul', class: 'list' })
  // $separators = cloneSeparators()
  // $yResizer = _({ class: 'y-resizer' })
  $container = _({ append: [this.$youtubeSongs] })

  subscriber = new Subscriber({
    CHANGE_ITEM_HEIGHT: () => {
      const {
        state: { itemHeight },
        collection,
        // separators,
        // yResizer,
      } = this

      collection.setItemHeight(itemHeight)
      // separators.setItemHeight(itemHeight)
      // yResizer.setItemHeight(itemHeight)
    },
  })

  changeItemHeight = itemHeight => {
    const { subscriber: { emit } } = this

    state.itemHeight = itemHeight

    emit('CHANGE_ITEM_HEIGHT')
  }

  constructor() {
    const { fetchItems } = this

    fetchItems()
  }
}

// on({
//   ITEMS_UPDATED: () => collection(state),
//   SET_RESIZER_POSITION: ({ size, position }) => {
//     _coords($youtubeSongs, { height: size })
//     _coords($yResizer, { top: position })
//   },
//   // RESIZER_MAX_CHANGE: ({ resizerMax }) => {
//   //   yResizer.setMax(resizerMax)
//   // },
//   // RESIZER_DISABLED: () => {
//   //   _class($yResizer, 'y-resizer disabled')
//   // },
//   // RESIZER_ENABLED: () => {
//   //   _class($yResizer, 'y-resizer')
//   // },
//   // RESIZER_CHANGE_COUNT: ({ resizerLength }) => {
//   //   const { size, position } = yResizer.setCount(resizerLength)

//   //   emit('SET_RESIZER_POSITION', { size, position })
//   // },
// })

// const resizerUpdateInterval = _delayInterval(resizerUpdate, 500)

// yResizer.on({
//   init: ({ size, position }) => {
//     emit('SET_RESIZER_POSITION', { size, position })
//   },
//   update: ({ size, position, count }) => {
//     emit('SET_RESIZER_POSITION', { size, position })

//     resizerUpdateInterval(count)
//   },
// })

// export default cloneContainer({
//   append: [$youtubeSongs, $separators, $yResizer],
// })
