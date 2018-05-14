import { mapGetters } from 'vuex'

const { assign } = Object

export default (TYPE, request) => {
  const defaultState = {
    loading: true,
    error: null
  }

  const getters = {
    loading: state => state.loading,
    error: state => state.error
  }

  const REQUEST = `${TYPE}@REQUEST`
  const SUCCESS = `${TYPE}@SUCCESS`
  const FAILURE = `${TYPE}@FAILURE`

  const mutations = {
    [REQUEST]: state => assign(state, { loading: true, error: null }),
    [SUCCESS]: (state, data) => assign(state, { loading: false, ...data }),
    [FAILURE]: (state, error) => assign(state, { loading: false, error })
  }

  const action = async (...args) => {
    const [{ commit }] = args

    try {
      commit(REQUEST)

      const data = await request(...args)

      commit(SUCCESS, data)
    } catch (error) {
      commit(FAILURE, error)
    }
  }

  const gettersMap = mapGetters([
    'loading',
    'error'
  ])

  return {
    TYPE,
    defaultState,
    getters,
    REQUEST,
    SUCCESS,
    FAILURE,
    mutations,
    action,
    gettersMap
  }
}
