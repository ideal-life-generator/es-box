import _state from '__/state' // eslint-disable-line

const state = {
  state: 'PAUSE',
}

export default state

export const { emit, on } = _state(state)

export const play = () => {
  state.state = 'PAUSE'

  emit('SHOW_PAUSE')
}

export const pause = () => {
  state.state = 'PLAY'

  emit('SHOW_PLAY')
}
