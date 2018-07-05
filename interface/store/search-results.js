import youtube from 'api'
import { PLAYER_SET_ITEM_MUTATION } from 'store/player'

const { assign } = Object

export const REQUEST_MUTATION = 'SEARCH_RESULTS@REQUEST'
export const SUCCESS_MUTATION = 'SEARCH_RESULTS@SUCCESS'
export const FAILURE_MUTATION = 'SEARCH_RESULTS@FAILURE'
export const SET_LIMIT_MUTATION = 'SEARCH_RESULTS@SET_LIMIT'
export const CLEAR_MUTATION = 'SEARCH_RESULTS@CLEAR'
export const CLEAR_LIMIT_MUTATION = 'SEARCH_RESULTS@CLEAR_LIMIT'
export const REQUEST_ACTION = 'SEARCH_RESULTS@REQUEST'
export const LOAD_MORE_ACTION = 'SEARCH_RESULTS@LOAD_MORE'

const defaultLimit = 5

export default {
  state: {
    loading: false,
    items: [],
    count: 0,
    total: 0,
    limit: defaultLimit,
    error: null
  },
  getters: {
    searchResults: state => state,
  },
  mutations: {
    [REQUEST_MUTATION]: state => assign(state, { loading: true, error: null }),
    [SUCCESS_MUTATION]: (state, data) => assign(state, { loading: false, ...data }),
    [FAILURE_MUTATION]: (state, error) => assign(state, { loading: false, error }),
    [CLEAR_MUTATION]: state => assign(state, { items: [], count: 0, limit: defaultLimit }),
    [CLEAR_LIMIT_MUTATION]: state => state.limit = defaultLimit,
    [SET_LIMIT_MUTATION]: (state, limit) => state.limit = limit
  },
  actions: {
    [REQUEST_ACTION]: async ({ state: { limit }, commit, rootState }) => {
      try {
        commit(REQUEST_MUTATION)

        const { items, total, count } = await youtube.search({ key: rootState.search.normalized, limit })

        if (!rootState.player._id && count > 0) {
          const [{ _id, title }] = items

          commit(PLAYER_SET_ITEM_MUTATION, { _id, title })
        }

        // await new Promise(r => setTimeout(r, 5000))

        commit(SUCCESS_MUTATION, { items, total, count })
      } catch (error) {
        commit(FAILURE_MUTATION, error)
      }
    },
    [LOAD_MORE_ACTION]: async ({ state: { loading, limit }, commit, dispatch }) => {
      if (!loading) {
        commit(SET_LIMIT_MUTATION, limit + defaultLimit)

        await dispatch(REQUEST_ACTION)
      }
    }
  }
}
