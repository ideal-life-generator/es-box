import _state from '__/state' // eslint-disable-line

const state = _state({
  activeMainButton: 'WAITING',
})

const deactivateMainButton = $element => {
  switch (state.activeMainButton) {
    case 'WAITING': {
      state.emit('HIDE_PLAY', $element)

      break
    }
    case 'PLAY': {
      state.emit('HIDE_PLAY', $element)

      break
    }
    case 'PAUSE': {
      state.emit('HIDE_PAUSE', $element)

      break
    }
    default: {
      break
    }
  }
}

export const play = $element => {
  deactivateMainButton($element)

  state.activeMainButton = 'PAUSE'

  state.emit('SHOW_PAUSE')
}

export const pause = $element => {
  deactivateMainButton($element)

  state.activeMainButton = 'PLAY'

  state.emit('SHOW_PLAY')
}

export default state
