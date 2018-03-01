import _ from '_'
import Subscriber from '__/subscriber'
import Collection from '_/collection'
import _classAdd from '_/class-add'
import _coords from '_/coords'
import _assign from '__/assign'
import Item from './item'
import { moveTop, hide } from '../../../utils/animations'
import searchState from '../../search/state'
import { search } from '../../../api/youtube'
import {
  SMALL_ITEM_HEIGHT,
  NORMAL_ITEM_HEIGHT,
} from '../settings'

export default class YoutubeSongs {
  static sizeTypes = {
    SMALL: {
      className: 'small',
      itemHeight: SMALL_ITEM_HEIGHT,
    },
    NORMAL: {
      className: 'normal',
      itemHeight: NORMAL_ITEM_HEIGHT,
    },
  }

  state = {
    className: 'small',
    itemHeight: SMALL_ITEM_HEIGHT,
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
  $youtubeSongs = _({ el: 'ul', class: 'list' })
  collection = new Collection(this.$youtubeSongs, {
    create: index => {
      const { state: { itemHeight } } = this

      const item = new Item({ index })

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
      const { state: { itemHeight } } = this

      moveTop($item, previousIndex * itemHeight, nextIndex * itemHeight)
    },
    remove: ({ $item }) => hide($item),
  })
  // $separators = cloneSeparators()
  // $yResizer = _({ class: 'y-resizer' })
  $container = _({ append: [this.$youtubeSongs] })

  subscriber = new Subscriber({
    ITEMS_UPDATED: () => {
      const { state, collection } = this

      collection.setItems(state)
    },
    SIZE_TYPE_CHANGED: () => {
      const {
        state: {
          className,
          // itemHeight,
        },
        $container,
        // separators,
        // yResizer,
      } = this

      _classAdd($container, className)

      // collection.setItemHeight(itemHeight)
      // separators.setItemHeight(itemHeight)
      // yResizer.setItemHeight(itemHeight)
    },
    SIZE_CHANGED: () => {
      const {
        sizeTypes,
        state: { sizeType },
        $results,
        $youtubeSongs,
      } = this
      const {
        [sizeType]: {
          class: sizeClass,
          itemHeight,
        },
      } = sizeTypes

      _classAdd($results, sizeClass)

      $youtubeSongs.changeItemHeight(itemHeight)
    },
  })

  changeSizeType = sizeType => {
    const { state, subscriber: { emit } } = this
    const {
      sizeTypes: {
        [sizeType]: {
          className,
          itemHeight,
        },
      },
    } = YoutubeSongs

    state.className = className
    state.itemHeight = itemHeight

    emit('SIZE_TYPE_CHANGED')
  }

  fetchItems = async () => {
    const { state, subscriber: { emit } } = this

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

  constructor() {
    const { changeSizeType, fetchItems } = this

    changeSizeType('SMALL')

    fetchItems()
  }
}
