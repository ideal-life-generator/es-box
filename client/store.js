import { Store } from 'vuex'

export default () => new Store({
  state: {
    value: '',
  },
  getters: {
    getValue: state => state.value,
  },
  mutations: {
    updateValue: (state, value) => state.value = value,
    clearValue: state => state.value = '',
  },
  actions: {
    updateValue: ({ commit }, { target: { value } }) => commit('updateValue', value),
    clearValue: ({ commit }) => commit('clearValue'),
  },
})
