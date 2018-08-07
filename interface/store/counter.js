export const COUNTER_UPDATE = 'COUNTER@UPDATE'
export const COUNTER_UPDATE_CURRENT = 'COUNTER@UPDATE_CURRENT'
export const COUNTER_UPDATE_TOTAL = 'COUNTER@UPDATE_TOTAL'

export default {
  state: {
    current: null,
    total: null
  },
  getters: {
    counter: state => state
  },
  mutations: {
    [COUNTER_UPDATE]: (state, { current, total }) => {
      Object.assign(state, { current, total })
    },
    [COUNTER_UPDATE_CURRENT]: (state, current) => {
      state.current = current
    },
    [COUNTER_UPDATE_TOTAL]: (state, total) => {
      state.total = total
    }
  }
}
