import youtube from 'api'
import createAsyncAction from './utils/create-async-action'

const { assign } = Object

const defaultLimit = 50

export const fetchPlaylistSongs = createAsyncAction('SEARCH_RESULTS_ACTIONS@FETCH_SEARCH_RESULTS', async ({ rootState }) => {
  try {
    const { items: youtubeVideos, count, total, nextPageToken } = await youtube.search({ key: rootState.search.normalized, limit: defaultLimit })

    const normalizedItems = youtubeVideos.map(youtubeVideo => ({
      youtubeVideo,
    }))

    return {
      items: normalizedItems,
      count,
      total,
      nextPageToken,
    }
  } catch (error) {
    console.error(error)

    throw error
  }
}, {
  dataKey: 'spread',
})

// const CLEAR_MUTATION = 'SEARCH_RESULTS@CLEAR'
// const MORE_MUTATION = 'SEARCH_RESULTS@MORE'

export default {
  state: {
    items: [],
    count: 0,
    total: 0,
    nextPageToken: null,
    progressing: false,
    error: null,
    limit: defaultLimit,
    currentItemIndex: null,
  },
  getters: {
    searchResults: state => state,
  },
  mutations: assign(fetchPlaylistSongs.mutations, {
    // [MORE_MUTATION]: (state, { items, count, total, nextPageToken }) => assign(state, {
    //   loading: false,
    //   items: [...state.items, ...items],
    //   count: state.count + count,
    //   total,
    //   nextPageToken,
    // }),
    // [CLEAR_MUTATION]: state => assign(state, { items: [], count: 0, limit: defaultLimit, nextPageToken: null }),
  }),
  actions: assign(fetchPlaylistSongs.actions, {
    // [LOAD_MORE_ACTION]: async ({ state: { loading, limit, nextPageToken }, commit, dispatch }) => {
    //   if (!loading) {
    //     commit(SET_LIMIT_MUTATION, limit + defaultLimit)

    //     await dispatch(REQUEST_ACTION, nextPageToken)
    //   }
    // },
  }),
}
