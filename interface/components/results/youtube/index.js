import _collection from '_/collection' // eslint-disable-line
import _coords from '_/coords' // eslint-disable-line
import _delayInterval from '__/delay-interval' // eslint-disable-line
import _class from '_/class' // eslint-disable-line
import { $youtubeSongs, $separators, $yResizer } from './elements'
import { cloneContainer } from '../cloners'
import collection from './collection'
import state, { emit, on, fetchItems, resizerUpdate } from './state'
import yResizer from './y-resizer'

(async () => await fetchItems())()

on({
  ITEMS_UPDATED: () => collection(state),
  SET_RESIZER_POSITION: ({ size, position }) => {
    _coords($youtubeSongs, { height: size })
    _coords($yResizer, { y: position })
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

export default cloneContainer({
  append: [$youtubeSongs, $separators, $yResizer],
})
