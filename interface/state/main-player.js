import { emit } from '../utils/subscriber'

const state = {
  paused: true,
}

export const play = () => {
  state.paused = false

  emit('PLAY')
}

export const pause = () => {
  state.paused = true

  emit('PAUSE')
}

export default state
