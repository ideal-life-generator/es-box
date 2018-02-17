import _state from '__/state' // eslint-disable-line

const state = {
  state: 'WAITING',
}

export default state

export const { emit, on } = _state(state)

const deactivateMainButton = $element => {
  switch (state.state) {
    case 'WAITING': {
      emit('HIDE_PLAY', $element)

      break
    }
    case 'PLAY': {
      emit('HIDE_PLAY', $element)

      break
    }
    case 'PAUSE': {
      emit('HIDE_PAUSE', $element)

      break
    }
    default: {
      break
    }
  }
}

export const play = $element => {
  deactivateMainButton($element)

  state.state = 'PAUSE'

  emit('SHOW_PAUSE')
}

export const pause = $element => {
  deactivateMainButton($element)

  state.state = 'PLAY'

  emit('SHOW_PLAY')
}
