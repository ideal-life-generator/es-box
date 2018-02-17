import _state from '__/state' // eslint-disable-line
import _assign from '__/assign' // eslint-disable-line
import searchState from '../../search/state'
import { search } from '../../../api/youtube'

const { now } = Date

const state = {
  fetching: false,
  items: null,
  count: null,
  total: null,
  resizerMin: 1,
  resizerMax: 100,
  resizerLength: 5,
  resizerUpdateTime: now(),
  resizerDisabled: false,
  lastManualResizerLength: null,
  lastResizerMax: null,
}

export default state

export const { emit, on } = _state(state)

// const countChanged = () => {
//   // j gyuh jgu
//   const {
//     count,
//     resizerLength,
//     lastManualResizerLength,
//     lastResizerMax,
//     resizerMin,
//     resizerMax,
//     resizerDisabled,
//   } = state

//   if (count < resizerLength) {
//     if (!lastManualResizerLength) {
//       state.lastManualResizerLength = resizerLength
//     }

//     if (!lastResizerMax) {
//       state.lastResizerMax = resizerMax
//     }

//     if (count <= resizerMin) {
//       state.resizerDisabled = true

//       emit('RESIZER_DISABLED')
//     }

//     _assign(state, {
//       resizerMax: count,
//       resizerLength: count,
//     })

//     emit('RESIZER_MAX_CHANGE')
//     emit('RESIZER_CHANGE_COUNT')
//   } else if (lastManualResizerLength && lastResizerMax && count > resizerLength) {
//     if (count < lastManualResizerLength) {
//       _assign(state, {
//         resizerMax: count,
//         resizerLength: count,
//       })
//     } else {
//       _assign(state, {
//         resizerMax: lastResizerMax,
//         resizerLength: lastManualResizerLength,
//         lastResizerMax: null,
//         lastManualResizerLength: null,
//       })
//     }

//     if (count > resizerMin && resizerDisabled) {
//       emit('RESIZER_ENABLED')
//     }

//     emit('RESIZER_MAX_CHANGE')
//     emit('RESIZER_CHANGE_COUNT')
//   }
// }

// const totalChanged = () => {
//   const {
//     total,
//     max,
//     resizerLength,
//   } = state

//   if (total < max) {
//     _assign(state, {
//       lastMax: max,
//       max: total,
//     })

//     if (total < resizerLength) {
//       _assign(state, {
//         lastManualResizerLength: resizerLength,
//         resizerLength: total,
//       })
//     }
//   }
// }

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

export const resizerUpdate = resizerLength => {
  state.resizerLength = resizerLength
  state.resizerUpdateTime = now()

  fetchItems()
}
