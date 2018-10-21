import createAsyncAction from 'store/utils/create-async-action'
import youtube from 'api'
import {
  PLAYER_SET_PLAY_ACTION,
  PLAYER_SET_PAUSE_ACTION,
  PLAYER_SET_ITEM_ACTION,
  SEARCH_RESULTS,
} from 'store/player'
import {
  YOUTUBE_VIDEO_PLAYER_ACTIONS_PLAY,
  YOUTUBE_VIDEO_PLAYER_ACTIONS_PAUSE,
} from 'store/youtube-player'

const { assign } = Object

const defaultLimit = 50

export const SEARCH_RESULTS_ACTIONS_PLAY = 'SEARCH_RESULTS_ACTIONS@PLAY'
export const SEARCH_RESULTS_ACTIONS_SET_ITEM = 'SEARCH_RESULTS_ACTIONS@SET_ITEM'
export const SEARCH_RESULTS_ACTIONS_PAUSE = 'SEARCH_RESULTS_ACTIONS@PAUSE'
export const SEARCH_RESULTS_ACTIONS_PLAY_PREVIOUS = 'SEARCH_RESULTS_ACTIONS@PLAY_PREVIOUS'
export const SEARCH_RESULTS_ACTIONS_PLAY_NEXT = 'SEARCH_RESULTS_ACTIONS@PLAY_NEXT'

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
    searchResultsCurrentItemIndex: (state, getters, rootState) =>
      state.items.findIndex(item => item.youtubeVideo._id === rootState.player.item.youtubeVideo._id),
  },
  mutations: assign(fetchPlaylistSongs.mutations, {
  }),
  actions: assign(fetchPlaylistSongs.actions, {
    [SEARCH_RESULTS_ACTIONS_PLAY]: ({ dispatch, rootState }, item) => {
      if (!rootState.player.item.youtubeVideo._id || rootState.player.item.youtubeVideo._id !== item._id) {
        dispatch(PLAYER_SET_ITEM_ACTION, { itemIn: SEARCH_RESULTS, item })
      }

      dispatch(PLAYER_SET_PLAY_ACTION)

      dispatch(YOUTUBE_VIDEO_PLAYER_ACTIONS_PLAY)
    },
    [SEARCH_RESULTS_ACTIONS_PAUSE]: ({ dispatch }) => {
      dispatch(PLAYER_SET_PAUSE_ACTION)

      dispatch(YOUTUBE_VIDEO_PLAYER_ACTIONS_PAUSE)
    },
    [SEARCH_RESULTS_ACTIONS_PLAY_PREVIOUS]: ({ dispatch, state, getters, rootState }) => {
      const currentItemIndex = getters.searchResultsCurrentItemIndex

      let nextItemIndex
      if (currentItemIndex > 0) {
        nextItemIndex = currentItemIndex - 1
      } else if (rootState.player.repeatAll) {
        nextItemIndex = state.total - 1
      } else {
        nextItemIndex = currentItemIndex
      }

      if (nextItemIndex !== currentItemIndex) {
        const nextItem = state.items[nextItemIndex]

        dispatch(PLAYER_SET_ITEM_ACTION, { itemIn: SEARCH_RESULTS, item: nextItem })

        if (rootState.player.play) {
          dispatch(YOUTUBE_VIDEO_PLAYER_ACTIONS_PLAY)
        }
      }
    },
    [SEARCH_RESULTS_ACTIONS_PLAY_NEXT]: ({ dispatch, state, getters, rootState }) => {
      const currentItemIndex = getters.searchResultsCurrentItemIndex

      let nextItemIndex
      if (currentItemIndex < state.total - 1) {
        nextItemIndex = currentItemIndex + 1
      } else if (rootState.player.repeatAll) {
        nextItemIndex = 0
      } else {
        nextItemIndex = currentItemIndex
      }

      if (nextItemIndex !== currentItemIndex) {
        const nextItem = state.items[nextItemIndex]

        dispatch(PLAYER_SET_ITEM_ACTION, { itemIn: SEARCH_RESULTS, item: nextItem })

        if (rootState.player.play) {
          dispatch(YOUTUBE_VIDEO_PLAYER_ACTIONS_PLAY)
        }
      }
    },
  }),
}
