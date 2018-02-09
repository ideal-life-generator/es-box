import _state from '__/state' // eslint-disable-line
import _assign from '__/assign' // eslint-disable-line
import searchState from '../../search/state'
import { search } from '../../../../youtube'

// const { now } = Date

const state = _state({
  fetching: false,
  items: [],
  count: 5,
})

export const fetchItems = async () => {
  state.fetching = true

  const { items, count, total } = await search({ key: searchState.normalizedValue, count: state.count })

  _assign(state, {
    fetching: false,
    items,
    count,
    total,
  })

  state.emit('ITEMS_UPDATED')
}

export const resizerUpdate = count => {
  state.count = count

  fetchItems()
}

export default state
