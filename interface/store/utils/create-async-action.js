const { assign } = Object

export default (key, request, options = {}) => {
  const REQUEST_MUTATION_TYPE = `${key}_REQUEST_MUTATION`
  const SUCCESS_MUTATION_TYPE = `${key}_SUCCESS_MUTATION`
  const FAILURE_MUTATION_TYPE = `${key}_FAILURE_MUTATION`

  const ACTION_TYPE = `${key}_ACTION`

  const progressingKey = options.progressingKey || 'progressing'
  const errorKey = options.errorKey || 'error'

  const mutationRequest = state => assign(state, {
    [progressingKey]: true,
    [errorKey]: null,
  })

  const mutationSuccess = (state, data) => assign(state, {
    [progressingKey]: false,
    ...data,
  })

  const mutationFailure = (state, error) => assign(state, {
    [progressingKey]: false,
    [errorKey]: error,
  })

  const action = async (store, ...args) => {
    const { commit } = store

    try {
      commit(REQUEST_MUTATION_TYPE)

      const result = await request(store, ...args)

      commit(SUCCESS_MUTATION_TYPE, result)
    } catch (error) {
      console.error(ACTION_TYPE, error)

      commit(FAILURE_MUTATION_TYPE)
    }
  }

  const mutations = {
    [REQUEST_MUTATION_TYPE]: mutationRequest,
    [SUCCESS_MUTATION_TYPE]: mutationSuccess,
    [FAILURE_MUTATION_TYPE]: mutationFailure,
  }

  const actions = {
    [ACTION_TYPE]: action,
  }

  return {
    REQUEST_MUTATION_TYPE,
    SUCCESS_MUTATION_TYPE,
    FAILURE_MUTATION_TYPE,
    ACTION_TYPE,
    mutations,
    actions,
  }
}
