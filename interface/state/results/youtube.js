import _assign from '__/assign'
import { emit } from '../../utils/subscriber'
import { search } from '../../api/youtube'
import searchState from '../search'
import { smallItemHeight as smallItemHeightString } from '../../components/youtube-item.sass'

export const SMALL_ITEM_HEIGHT = parseFloat(smallItemHeightString)

const state = {
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
  state.itemHeight = SMALL_ITEM_HEIGHT

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

export default state
