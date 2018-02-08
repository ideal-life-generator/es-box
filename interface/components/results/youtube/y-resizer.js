import _resizer from '_/resizer' // eslint-disable-line
import { $youtubeSongs, $yResizer } from './elements'
import state from './state'
import { itemHeight } from '../settings'

export default _resizer($youtubeSongs, {
  y: {
    activator: $yResizer,
    count: state.count,
    min: 1,
    max: 100,
    size: itemHeight,
  },
})
