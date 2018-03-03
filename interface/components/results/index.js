import _ from '_'
// import ﾟuserSongs from './user-songs'
import { $youtube } from './youtube'
import {
  smallItemHeight as smallItemHeightString,
  normalItemHeight as normalItemHeightString,
} from './index.sass'

export const sizeTypes = {
  SMALL: {
    className: 'small',
    itemHeight: parseFloat(smallItemHeightString),
  },
  NORMAL: {
    className: 'normal',
    itemHeight: parseFloat(normalItemHeightString),
  },
}

export const $results = _({
  class: 'results',
  append: [$youtube],
})
