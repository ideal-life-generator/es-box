import _cloner from '_/cloner' // eslint-disable-line
import { $play, $pause } from './elements'

export const play = _cloner({
  node: $play,
}, true)

export const pause = _cloner({
  node: $pause,
}, true)
