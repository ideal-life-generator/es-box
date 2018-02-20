import _ from '_'
import {
  list as cloneList,
  separators as cloneSeparators,
} from '../cloners'

export const $youtubeSongs = cloneList()

export const $separators = cloneSeparators()

export const $yResizer = _({
  class: 'y-resizer',
})
