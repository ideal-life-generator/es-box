import _ from '_'
import Collection from '_/collection'
import _classAdd from '_/class-add'
import _coords from '_/coords'
// import Separators from '_/separators'
import Item from '../../components/youtube-item'
import state, { changeSizeType, fetchItems } from '../../state/results/youtube'
import { moveTop } from '../../utils/animations'
import { on } from '../../utils/subscriber'
import './index.sass'

// export const separators = _cloner({
//   el: 'ul',
//   class: 'separators',
// })

// export const separator = _cloner({
//   el: 'li',
//   class: 'separator',
// })

// export const separators = new Separators({
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

    _coords(item.$item.node, { top: index * itemHeight })

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

    moveTop($item.node, previousIndex * itemHeight, nextIndex * itemHeight)
  },
  remove: ({ toggleSwitchShowHideItem }) => toggleSwitchShowHideItem(false),
})

// $separators = cloneSeparators()
// $yResizer = _({ class: 'y-resizer' })

export const $youtube = _({ class: 'youtube', append: [$list] })

on({
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
