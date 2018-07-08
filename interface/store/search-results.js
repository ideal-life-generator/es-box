import youtube from 'api'
import { SET_ITEM_ACTION } from 'store/player'

const { assign } = Object

export const REQUEST_MUTATION = 'SEARCH_RESULTS@REQUEST'
export const SUCCESS_MUTATION = 'SEARCH_RESULTS@SUCCESS'
export const FAILURE_MUTATION = 'SEARCH_RESULTS@FAILURE'
export const SET_LIMIT_MUTATION = 'SEARCH_RESULTS@SET_LIMIT'
export const CLEAR_MUTATION = 'SEARCH_RESULTS@CLEAR'
export const CLEAR_LIMIT_MUTATION = 'SEARCH_RESULTS@CLEAR_LIMIT'
export const SET_CURRENT_INDEX_MUTATION = 'SEARCH_RESULTS@SET_CURRENT_INDEX'
export const REQUEST_ACTION = 'SEARCH_RESULTS@REQUEST'
export const LOAD_MORE_ACTION = 'SEARCH_RESULTS@LOAD_MORE'

const defaultLimit = 50

const parseLimit = limit => Math.floor(limit / defaultLimit)

export default {
  state: {
    loading: false,
    items: [],
    count: 0,
    total: 0,
    limit: defaultLimit,
    currentIndex: null,
    nextPageToken: null,
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
    [SET_LIMIT_MUTATION]: (state, limit) => state.limit = limit,
    [SET_CURRENT_INDEX_MUTATION]: (state, _id) => {
      state.currentIndex = state.items.findIndex(item => _id === item._id)
    }
  },
  actions: {
    [REQUEST_ACTION]: async ({ state: { limit }, dispatch, commit, rootState }) => {
      try {
        commit(REQUEST_MUTATION)

        const pages = parseLimit(limit)

        const all = {
          items: [],
          count: 0,
          total: 0
        }
        let pageToken = null
        for (let i = 0; i < pages; i += 1) {
          try {
            const result = await youtube.search({ key: rootState.search.normalized, limit: 50, pageToken })

            assign(all, {
              items: [...all.items, ...result.items],
              count: all.count + result.count,
              total: result.total
            })

            pageToken = result.nextPageToken
          } catch (error) {

          }
        }

        commit(SUCCESS_MUTATION, all)

        if (!rootState.player._id && all.count > 0) {
          const [{ _id, title }] = all.items

          dispatch(SET_ITEM_ACTION, { _id, title })
        }
      } catch (error) {
        console.error(error)

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
