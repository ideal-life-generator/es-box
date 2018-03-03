import _ from '_'
import Subscriber from '__/subscriber'
import Collection from '_/collection'
import _classAdd from '_/class-add'
import _coords from '_/coords'
import _assign from '__/assign'
import Item from './item'
import { moveTop, hide } from '../../../utils/animations'
// import searchState from '../../search/state'
import { search } from '../../../api/youtube'
import { state as searchState } from '../../search'

export const state = {
  className: null,
  itemHeight: null,
}

export const changeSizeType = sizeType => {
  // const {
  //   [sizeType]: {
  //     className,
  //     itemHeight,
  //   },
  // } = sizeTypes

  state.className = 'small'
  state.itemHeight = 145

  emit('SIZE_TYPE_CHANGED')
}

export const fetchItems = async () => {
  state.fetching = true

  // const { resizerUpdateTime: resizerUpdateTimeBeforeRequest } = state

  const { data: { items, count, total } } = await search({
    key: searchState.normalizedValue,
    count: state.lastManualResizerLength ? state.lastManualResizerLength : state.resizerLength,
  })

  _assign(state, {
    fetching: false,
    items,
    count,
    total,
  })

  // const { resizerUpdateTime: resizerUpdateTimeAfterRequest } = state

  // if (resizerUpdateTimeAfterRequest <= resizerUpdateTimeBeforeRequest) {
  //   totalChanged()
  //   countChanged()
  // }

  emit('ITEMS_UPDATED')
}

// separators = new Separators({
//   create: i => cloneSeparator({
//     coords: { top: i * itemHeight },
//     created: $element => show($element),
//   }),
//   remove: $separator => hide($separator),
// })
// yResizer = new YResizer($youtube, {
//   y: {
//     activator: $yResizer,
//     count: state.resizerLength,
//     min: state.resizerMin,
//     max: state.resizerMax,
//     size: itemHeight,
//   },
// })

export const $list = _({ el: 'ul', class: 'list' })

export const collection = new Collection($list, {
  create: index => {
    const { itemHeight } = state

    const item = new Item({ index, currentTime: 0 })

    _coords(item.$item, { top: index * itemHeight })

    return item
  },
  update: {
    id: (item, id) => item.setSource(`http://localhost:3001/youtube/mp3/${id}`),
    thumbnailUrl: (item, thumbnailUrl) => item.setThumbnailUrl(thumbnailUrl),
    title: (item, title) => item.setTitle(title),
    duration: (item, duration) => item.setDuration(duration),
  },
  move: ({ $item }, { previousIndex, nextIndex }) => {
    const { itemHeight } = state

    moveTop($item, previousIndex * itemHeight, nextIndex * itemHeight)
  },
  remove: ({ $item }) => hide($item),
})

// $separators = cloneSeparators()
// $yResizer = _({ class: 'y-resizer' })

export const $youtube = _({ append: [$list] })

export const { emit, on } = new Subscriber({
  ITEMS_UPDATED: () => collection.setItems(state),
  SIZE_TYPE_CHANGED: () => {
    const { className } = state

    _classAdd($youtube, className)

    // collection.setItemHeight(itemHeight)
    // separators.setItemHeight(itemHeight)
    // yResizer.setItemHeight(itemHeight)
  },
  // SIZE_CHANGED: () => {
  //   const {
  //     $results,
  //     $youtube,
  //   } = this
  //   const {
  //     [sizeType]: {
  //       class: sizeClass,
  //       itemHeight,
  //     },
  //   } = sizeTypes

  //   _classAdd($results, sizeClass)

  //   $youtube.changeItemHeight(itemHeight)
  // },
})

changeSizeType('SMALL')

fetchItems()
