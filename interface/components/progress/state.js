import _state from '__/state' // eslint-disable-line

export default () => {
  const state = {
    size: null,
    time: {
      hours: null,
      munites: null,
      seconds: null,
    },
  }

  const { emit, on } = _state(state)

  const setSize = size => {
    state.size = size

    emit('WIDTH_CHANGED')
  }

  const setTime = time => {
    state.time = time

    emit('TIME_CHANGED')
  }

  return {
    state,
    emit,
    on,
    setSize,
    setTime,
  }
}
