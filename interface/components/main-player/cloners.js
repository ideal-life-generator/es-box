import _cloner from '_/cloner' // eslint-disable-line
import { $play, $pause } from './elements'

export const clonePlayIcon = _cloner({
  node: $play,
}, true)

export const clonePauseIcon = _cloner({
  node: $pause,
}, true)
