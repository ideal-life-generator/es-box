import _state from '__/state' // eslint-disable-line

export default () => {
  const state = {
    size: null,
    duration: null,
    currentTime: null,
  }

  const { emit, on } = _state(state)

  const setSize = size => {
    state.size = size

    emit('SIZE_CHANGED')
  }

  const setDuration = duration => {
    state.duration = duration

    emit('DURATION_CHANGED')
  }

  const setCurrentTime = currentTime => {
    state.currentTime = currentTime

    emit('CURRENT_TIME_CHANGED')
  }

  return {
    state,
    emit,
    on,
    setSize,
    setDuration,
    setCurrentTime,
  }
}
