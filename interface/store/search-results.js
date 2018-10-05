import createAsyncAction from './utils/create-async-action'
import youtube from 'api'
import bus from 'events-bus'
import {
  SEARCH_RESULTS,
  PLAYER_PLAY_ACTION,
  PLAYER_PAUSE_ACTION,
  PLAYER_SET_ITEM_ACTION,
} from 'store/player'
import {
  YOUTUBE_VIDEO_PLAYER_PLAY,
  YOUTUBE_VIDEO_PLAYER_PAUSE,
} from 'containers/YoutubeVideo.vue'

const { assign } = Object

const defaultLimit = 50

export const SEARCH_RESULTS_ACTIONS_PLAY = 'SEARCH_RESULTS_ACTIONS@PLAY'
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
      state.items.findIndex(item => item.youtubeVideo._id === rootState.player.item.youtubeVideo._id)
  },
  mutations: assign(fetchPlaylistSongs.mutations, {
  }),
  actions: assign(fetchPlaylistSongs.actions, {
    [SEARCH_RESULTS_ACTIONS_PLAY]: ({ dispatch }, item) => {
      if (item) {
        dispatch(PLAYER_PLAY_ACTION, { itemIn: SEARCH_RESULTS, item })
      } else {
        dispatch(PLAYER_PLAY_ACTION)
      }

      bus.$emit(YOUTUBE_VIDEO_PLAYER_PLAY)
    },
    [SEARCH_RESULTS_ACTIONS_PAUSE]: ({ dispatch }) => {
      dispatch(PLAYER_PAUSE_ACTION)

      bus.$emit(YOUTUBE_VIDEO_PLAYER_PAUSE)
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

        if (!rootState.player.play) {
          dispatch(PLAYER_SET_ITEM_ACTION, { itemIn: SEARCH_RESULTS, item: nextItem })
        } else {
          dispatch(PLAYER_PLAY_ACTION, { itemIn: SEARCH_RESULTS, item: nextItem })
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

        if (!rootState.player.play) {
          dispatch(PLAYER_SET_ITEM_ACTION, { itemIn: SEARCH_RESULTS, item: nextItem })
        } else {
          dispatch(PLAYER_PLAY_ACTION, { itemIn: SEARCH_RESULTS, item: nextItem })
        }
      }
    },
  }),
}
