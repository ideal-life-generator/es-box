import _state from '__/state' // eslint-disable-line
import _assign from '__/assign' // eslint-disable-line

export default () => {
  const state = {
    position: {
      left: null,
      top: null,
    },
    size: null,
    loading: false,
  }

  const { emit, on } = _state(state)

  const setPosition = position => {
    _assign(state.position, position)

    emit('POSITION_CHANGED')
  }

  const setSize = size => {
    state.size = size

    emit('SIZE_CHANGED')
  }

  const setLoading = loading => {
    state.loading = loading

    if (state.loading) {
      emit('LOADING')
    } else {
      emit('LOADED')
    }
  }

  return {
    state,
    emit,
    on,
    setPosition,
    setSize,
    setLoading,
  }
}
