import { search } from '../apis/youtube'

export default {
  state: {
    value: '',
    maxResults: 10,
    youtube: {
      total: 0,
      items: [],
    },
  },
  getters: {
    value: ({ value }) => value,
    youtube: ({ youtube }) => youtube,
  },
  mutations: {
    updateValue: (state, value) => state.value = value,
    clearValue: state => state.value = '',
    updateYoutube: (state, youtube) => state.youtube = youtube,
  },
  actions: {
    async updateValue({ commit, state: { maxResults } }, { target: { value } }) {
      commit('updateValue', value)

      const data = await search({
        q: value,
        maxResults,
      })

      commit('updateYoutube', data)
    },
    clearValue: ({ commit }) => commit('clearValue'),
  },
}
