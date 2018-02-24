import _coords from '_/coords'
import _delayInterval from '__/delay-interval'
import { $youtubeSongs, $separators, $yResizer } from './elements'
import { container as cloneContainer } from '../cloners'
import collection from './collection'
import state, { emit, on, fetchItems, resizerUpdate } from './state'
import yResizer from './y-resizer'

export const cloneList = _cloner({ el: 'ul', class: 'list' })
export const cloneSeparators = _cloner({ el: 'ul', class: 'separators' })
export const cloneSeparator = _cloner({ el: 'li', class: 'separator' })
export const cloneYResizer = _cloner({ class: 'y-resizer' })

export default class YoutubeSongs {
  state = {
    itemHeight: null,
  }

  // separators = new Separators({

  // })
  // yResizer = new YResizer()
  collection = new Collection({
    create: index => {
      const { itemHeight } = this

      const item = new Item({ index })

      _coords(item.$item, { top: i * itemHeight })

      return item
    },
    update: {
      thumbnailUrl: (item, thumbnailUrl) => item.setThumbnail(thumbnailUrl),
      duration: (item, duration) => item.setDuration(duration),
      id: (item, id) => item.setSource(`http://localhost:3001/youtube/mp3/${id}`),
      title: (item, title) => item.setTitle(title),
      // title: (item, title) => _text($title, title),
    },
    move: ({ $item }, { previousIndex, nextIndex }) => moveTop($item, previousIndex * itemHeight, nextIndex * itemHeight),
    remove: ({ $item }) => hide($item),
  })
  $youtubeSongs = cloneList()
  // $separators = cloneSeparators()
  // $yResizer = _({ class: 'y-resizer' })
  $container = _({ append: [this.$youtubeSongs] })

  subscriber = new Subscriber({
    CHANGE_ITEM_HEIGHT: () => {
      const {
        state: { itemHeight },
        collection,
        separators,
        yResizer,
      } = this

      collection.setItemHeight(itemHeight)
      separators.setItemHeight(itemHeight)
      yResizer.setItemHeight(itemHeight)
    },
  })

  changeItemHeight = itemHeight => {
    const { subscriber: { emit } } = this

    state.itemHeight = itemHeight

    emit('CHANGE_ITEM_HEIGHT')
  }

  constructor() {
    const { collection } = this

    collection.fetchItems()
  }
}

on({
  ITEMS_UPDATED: () => collection(state),
  SET_RESIZER_POSITION: ({ size, position }) => {
    _coords($youtubeSongs, { height: size })
    _coords($yResizer, { top: position })
  },
  // RESIZER_MAX_CHANGE: ({ resizerMax }) => {
  //   yResizer.setMax(resizerMax)
  // },
  // RESIZER_DISABLED: () => {
  //   _class($yResizer, 'y-resizer disabled')
  // },
  // RESIZER_ENABLED: () => {
  //   _class($yResizer, 'y-resizer')
  // },
  // RESIZER_CHANGE_COUNT: ({ resizerLength }) => {
  //   const { size, position } = yResizer.setCount(resizerLength)

  //   emit('SET_RESIZER_POSITION', { size, position })
  // },
})

const resizerUpdateInterval = _delayInterval(resizerUpdate, 500)

yResizer.on({
  init: ({ size, position }) => {
    emit('SET_RESIZER_POSITION', { size, position })
  },
  update: ({ size, position, count }) => {
    emit('SET_RESIZER_POSITION', { size, position })

    resizerUpdateInterval(count)
  },
})

// export default cloneContainer({
//   append: [$youtubeSongs, $separators, $yResizer],
// })
