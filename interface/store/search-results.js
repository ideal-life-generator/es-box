import youtube from 'api'
import { PLAYER_SET_ITEM_ACTION } from 'store/player'
import { COUNTER_UPDATE } from 'store/counter'

const { assign } = Object

export const REQUEST_MUTATION = 'SEARCH_RESULTS@REQUEST'
export const SUCCESS_MUTATION = 'SEARCH_RESULTS@SUCCESS'
export const FAILURE_MUTATION = 'SEARCH_RESULTS@FAILURE'
export const SET_LIMIT_MUTATION = 'SEARCH_RESULTS@SET_LIMIT'
export const CLEAR_MUTATION = 'SEARCH_RESULTS@CLEAR'
export const CLEAR_LIMIT_MUTATION = 'SEARCH_RESULTS@CLEAR_LIMIT'
export const SET_CURRENT_INDEX_MUTATION = 'SEARCH_RESULTS@SET_CURRENT_INDEX'
export const MORE_MUTATION = 'SEARCH_RESULTS@MORE'
export const REQUEST_ACTION = 'SEARCH_RESULTS@REQUEST'
export const LOAD_MORE_ACTION = 'SEARCH_RESULTS@LOAD_MORE'

const defaultLimit = 50

// const parseLimit = limit => Math.floor(limit / defaultLimit)

export default {
  state: {
    loading: false,
    items: [],
    count: 0,
    total: 0,
    limit: defaultLimit,
    currentItemIndex: null,
    nextPageToken: null,
    error: null
  },
  getters: {
    searchResults: state => state,
  },
  mutations: {
    [REQUEST_MUTATION]: state => assign(state, { loading: true, error: null }),
    [SUCCESS_MUTATION]: (state, { items, count, total, nextPageToken }) => assign(state, {
      loading: false,
      items,
      count,
      total,
      nextPageToken
    }),
    [MORE_MUTATION]: (state, { items, count, total, nextPageToken }) => assign(state, {
      loading: false,
      items: [...state.items, ...items],
      count: state.count + count,
      total,
      nextPageToken
    }),
    [FAILURE_MUTATION]: (state, error) => assign(state, { loading: false, error }),
    [CLEAR_MUTATION]: state => assign(state, { items: [], count: 0, limit: defaultLimit, nextPageToken: null }),
    [CLEAR_LIMIT_MUTATION]: state => state.limit = defaultLimit,
    [SET_LIMIT_MUTATION]: (state, limit) => state.limit = limit,
    [SET_CURRENT_INDEX_MUTATION]: (state, _id) => {
      state.currentItemIndex = state.items.findIndex(item => _id === item._id)
    }
  },
  actions: {
    [REQUEST_ACTION]: async ({ state, dispatch, commit, rootState }, toNextPageToken) => {
      try {
        commit(REQUEST_MUTATION)

        const { items, count, total, nextPageToken } = await youtube.search({ key: rootState.search.normalized, limit: 50, pageToken: toNextPageToken })

        if (!toNextPageToken) {
          commit(SUCCESS_MUTATION, { items, count, total, nextPageToken })
        } else {
          commit(MORE_MUTATION, { items, count, total, nextPageToken })
        }

        if (!rootState.player._id && count > 0) {
          const [{ _id, title }] = items

          dispatch(PLAYER_SET_ITEM_ACTION, { _id, title })

          commit(SET_CURRENT_INDEX_MUTATION, _id)

          commit(COUNTER_UPDATE, { current: state.currentItemIndex, count: state.count })
        }
      } catch (error) {
        console.error(error)

        commit(FAILURE_MUTATION, error)
      }
    },
    [LOAD_MORE_ACTION]: async ({ state: { loading, limit, nextPageToken }, commit, dispatch }) => {
      if (!loading) {
        commit(SET_LIMIT_MUTATION, limit + defaultLimit)

        await dispatch(REQUEST_ACTION, nextPageToken)
      }
    }
  }
}
