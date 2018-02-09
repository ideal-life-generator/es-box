import _state from '__/state' // eslint-disable-line
import _assign from '__/assign' // eslint-disable-line
import searchState from '../../search/state'
import { search } from '../../../../youtube'

const { now } = Date

const state = _state({
  fetching: false,
  items: null,
  count: null,
  total: null,
  resizerLength: 5,
  resizerUpdateTime: now(),
  lessThanManualResizeMode: false,
  lastManualResizerLength: null,
})

export const fetchItems = async () => {
  state.fetching = true

  const { items, count, total } = await search({
    key: searchState.normalizedValue,
    count: !state.lessThanManualResizeMode ? state.resizerLength : state.lastManualResizerLength,
  })

  _assign(state, {
    fetching: false,
    items,
    count,
    total,
  })

  state.emit('ITEMS_UPDATED')
}

export const fetchItemsRecalculateResize = async () => {
  const {
    count: previousCount,
    resizerUpdateTime: resizerUpdateTimeBeforeRequest,
  } = state

  await fetchItems()

  const { resizerUpdateTime: resizerUpdateTimeAfterRequest } = state

  if (
    state.count < state.resizerLength &&
    resizerUpdateTimeAfterRequest <= resizerUpdateTimeBeforeRequest
  ) {
    if (!state.lessThanManualResizeMode) {
      state.lessThanManualResizeMode = true
      state.lastManualResizerLength = state.resizerLength

      state.emit('DISABLE_RESIZER')
    }

    state.resizerLength = state.count > 0 ? state.count : 1

    state.emit('CORRECT_RESIZER')
  } else if (
    state.lessThanManualResizeMode &&
    state.count > previousCount &&
    state.count <= state.lastManualResizerLength &&
    resizerUpdateTimeAfterRequest <= resizerUpdateTimeBeforeRequest
  ) {
    if (state.count >= state.lastManualResizerLength) {
      state.resizerLength = state.lastManualResizerLength
      state.lastManualResizerLength = null
      state.lessThanManualResizeMode = false

      state.emit('ENABLE_RESIZER')
    } else {
      state.resizerLength = state.count
    }

    state.emit('CORRECT_RESIZER')
  }

  state.emit('ITEMS_UPDATED')
}

export const resizerUpdate = resizerLength => {
  state.resizerLength = resizerLength
  state.resizerUpdateTime = now()

  fetchItems()
}

export default state
