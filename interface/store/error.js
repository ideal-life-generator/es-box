export const SHOW_ERROR = 'SHOW_ERROR'

export default {
  state: {
    show: false,
    message: '',
    timeout: 3000
  },
  getters: {
    showErrorMessage: state => state.show,
    errorMessage: state => state.message
  },
  mutations: {
    showErrorMessage: (state, message) => {
      state.message = message
      state.show = true
    },
    hideErrorMessage: state => {
      state.show = false
    }
  },
  actions: {
    [SHOW_ERROR]: (context, message) => {
      context.commit('showErrorMessage', message)

      setTimeout(() => {
        context.commit('hideErrorMessage')
      }, context.state.timeout)
    }
  }
}
