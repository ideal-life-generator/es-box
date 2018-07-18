export const COUNTER_UPDATE = 'COUNTER@UPDATE'
export const COUNTER_UPDATE_CURRENT = 'COUNTER@UPDATE_CURRENT'
export const COUNTER_UPDATE_COUNT = 'COUNTER@UPDATE_COUNT'

export default {
  state: {
    current: null,
    count: null
  },
  getters: {
    counter: state => state
  },
  mutations: {
    [COUNTER_UPDATE]: (state, { current, count }) => {
      Object.assign(state, { current, count })
    },
    [COUNTER_UPDATE_CURRENT]: (state, current) => {
      state.current = current
    },
    [COUNTER_UPDATE_COUNT]: (state, count) => {
      state.count = count
    }
  }
}
