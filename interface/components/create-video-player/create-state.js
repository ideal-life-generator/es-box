import _state from '__/state' // eslint-disable-line

export default () => {
  const state = {
    state: null,
  }

  const { emit, on } = _state(state)

  return {
    state,
    emit,
    on,
  }
}
