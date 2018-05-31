import api from 'api'

export const SEARCH_INPUT = 'SEARCH_INPUT'

export default {
  state: {
    isFetching: true
  },
  getters: {},
  mutations: {},
  actions: {
    token: async (state, code) => {
      const data = await api.token(code)

      console.log(data)
    }
  }
}
