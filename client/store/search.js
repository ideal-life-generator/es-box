export default {
  state: {
    value: '',
  },
  getters: {
    getValue: ({ value }) => value,
  },
  mutations: {
    updateValue: (state, value) => state.value = value,
    clearValue: state => state.value = '',
  },
  actions: {
    updateValue: ({ commit }, { target: { value } }) => commit('updateValue', value),
    clearValue: ({ commit }) => commit('clearValue'),
  },
}
