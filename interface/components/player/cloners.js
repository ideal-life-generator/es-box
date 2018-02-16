import cloner_ from '_/cloner' // eslint-disable-line
import { $play, $pause } from './elements'

export const clonePlayIcon = cloner_({
  node: $play,
}, true)

export const clonePauseIcon = cloner_({
  node: $pause,
}, true)
