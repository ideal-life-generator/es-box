import _resizer from '_/resizer'
import { $youtubeSongs, $yResizer } from './elements'
import state from './state'
import { itemHeight } from '../settings'

export default _resizer($youtubeSongs, {
  y: {
    activator: $yResizer,
    count: state.resizerLength,
    min: state.resizerMin,
    max: state.resizerMax,
    size: itemHeight,
  },
})
