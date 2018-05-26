import api from 'api'

export const SEARCH_INPUT = 'SEARCH_INPUT'

export default {
  state: {
    isFetching: true
  },
  getters: {},
  mutations: {},
  actions: {
    login: async () => {
      const data = await api.googleOAuth.auth()

      console.log(data)
    }
  }
}
