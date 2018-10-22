import createAsyncAction from 'store/utils/create-async-action'
import api from 'api'
import shuffle from 'utils/shuffle'
import {
  PLAYLIST,
  PLAYER_SET_PLAY_ACTION,
  PLAYER_SET_PAUSE_ACTION,
  PLAYER_SET_ITEM_ACTION,
} from 'store/player'
import {
  YOUTUBE_VIDEO_PLAYER_ACTIONS_PLAY,
  YOUTUBE_VIDEO_PLAYER_ACTIONS_PAUSE,
} from 'store/youtube-player'

const { assign } = Object

export const SONGS_MUTATION_SET_PLAYLIST_SONGS = 'SONGS_MUTATION@SET_PLAYLIST_SONGS'
export const SONGS_MUTATION_SET_PLAYLIST_SONGS_ITEMS = 'SONGS_MUTATION@SET_PLAYLIST_SONGS_ITEMS'

export const SONGS_ACTIONS_PLAY = 'SONGS_ACTIONS@PLAY'
export const SONGS_ACTIONS_PAUSE = 'SONGS_ACTIONS@PAUSE'
export const SONGS_ACTIONS_PLAY_PREVIOUS = 'SONGS_ACTION@PLAY_PREVIOUS'
export const SONGS_ACTIONS_PLAY_NEXT = 'SONGS_ACTION@PLAY_NEXT'
export const SONGS_ACTION_SHUFFLE_PLAYLIST_SONGS = 'SONGS_ACTION@SHUFFLE_PLAYLIST_SONGS'
export const SONGS_ACTION_UNSHUFFLE_PLAYLIST_SONGS = 'SONGS_ACTION@UNSHUFFLE_PLAYLIST_SONGS'

export const fetchPlaylistSongs = createAsyncAction('SONGS_ACTIONS@FETCH_PLAYLIST_SONGS', async ({ rootState, dispatch, commit }, playlistId) => {
  try {
    const playlistSongs = await api.playlistSongsQuery(playlistId)

    if (rootState.player.shuffle) {
      dispatch(SONGS_ACTION_SHUFFLE_PLAYLIST_SONGS, playlistSongs)
    } else {
      commit(SONGS_MUTATION_SET_PLAYLIST_SONGS, playlistSongs)
    }
  } catch (error) {
    console.log(error)

    throw (error && error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].message)
      ? error.graphQLErrors[0].message : error
  }
}, {
  progressingKey: 'fetching',
  errorKey: 'fetchingError'
})

export const addPlaylistSong = createAsyncAction('SONGS_ACTIONS@ADD_PLAYLIST_SONG', async ({ state }, { playlistId, youtubeVideoId, index }) => {
  try {
    const addedPlaylistSong = await api.addPlaylistSongMutation({ playlistId, youtubeVideoId, index })

    const nextPlaylistSongs = {
      items: [
        ...state.playlistSongs.items.slice(0, addedPlaylistSong.inPlaylistAs.index),
        addedPlaylistSong,
        ...state.playlistSongs.items.slice(addedPlaylistSong.inPlaylistAs.index).map(playlistSong => ({
          ...playlistSong,
          inPlaylistAs: {
            ...playlistSong.inPlaylistAs,
            index: playlistSong.inPlaylistAs.index + 1,
          },
        })),
      ],
      total: state.playlistSongs.total + 1,
    }

    return {
      playlistSongs: nextPlaylistSongs,
    }
  } catch (error) {
    console.log(error)

    throw (error && error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].message)
      ? error.graphQLErrors[0].message : error
  }
}, {
  progressingKey: 'adding',
  errorKey: 'addingError'
})

export const removePlaylistSong = createAsyncAction('SONGS_ACTIONS@REMOVE_PLAYLIST_SONG', async ({ state }, { playlistId, itemId }) => {
  try {
    const removedPlaylistSong = await api.removePlaylistSongMutation({ playlistId, itemId })

    const nextPlaylistSongs = {
      items: [
        ...state.playlistSongs.items.slice(0, removedPlaylistSong.inPlaylistAs.index),
        ...state.playlistSongs.items.slice(removedPlaylistSong.inPlaylistAs.index + 1).map(playlistSong => ({
          ...playlistSong,
          inPlaylistAs: {
            ...playlistSong.inPlaylistAs,
            index: playlistSong.inPlaylistAs.index - 1,
          },
        })),
      ],
      total: state.playlistSongs.total - 1,
    }

    return {
      playlistSongs: nextPlaylistSongs,
    }
  } catch (error) {
    console.log(error)

    throw (error && error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].message)
      ? error.graphQLErrors[0].message : error
  }
}, {
  progressingKey: 'removing',
  errorKey: 'removingError'
})

export const movePlaylistSong = createAsyncAction('SONGS_ACTIONS@MOVE_PLAYLIST_SONG', async ({ state }, {
  playlistId,
  inPlaylistAsId,
  currentIndex,
  nextIndex,
}) => {
  try {
    const movedPlaylistSong = await api.movePlaylistSongMutation({
      playlistId,
      inPlaylistAsId,
      currentIndex,
      nextIndex,
    })

    let nextPlaylistSongs
    const { playlistSongs: { items, ...playlistSongs } } = state
    if (nextIndex > currentIndex) {
      nextPlaylistSongs = {
        ...playlistSongs,
        items: [
          ...items.slice(0, currentIndex),
          ...items.slice(currentIndex + 1, nextIndex + 1).map(playlistSong => ({
            ...playlistSong,
            inPlaylistAs: {
              ...playlistSong.inPlaylistAs,
              index: playlistSong.inPlaylistAs.index - 1,
            },
          })),
          {
            ...items[currentIndex],
            inPlaylistAs: {
              ...items[currentIndex].inPlaylistAs,
              index: nextIndex,
            },
          },
          ...items.slice(nextIndex + 1),
        ],
      }
    } else {
      nextPlaylistSongs = {
        ...state.playlistSongs,
        items: [
          ...items.slice(0, nextIndex),
          {
            ...items[currentIndex],
            inPlaylistAs: {
              ...items[currentIndex].inPlaylistAs,
              index: nextIndex,
            },
          },
          ...items.slice(nextIndex, currentIndex).map(playlistSong => ({
            ...playlistSong,
            inPlaylistAs: {
              ...playlistSong.inPlaylistAs,
              index: playlistSong.inPlaylistAs.index + 1,
            },
          })),
          ...items.slice(currentIndex + 1),
        ],
      }
    }

    return {
      playlistSongs: nextPlaylistSongs,
    }
  } catch (error) {
    console.log(error)

    throw (error && error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].message)
      ? error.graphQLErrors[0].message : error
  }
}, {
  progressingKey: 'removing',
  errorKey: 'removingError'
})

export default {
  state: {
    playlistSongs: {
      items: [],
      total: null,
    },
    fetching: false,
    fetchingError: null,
    adding: false,
    addingError: null,
  },
  getters: {
    songs: state => state,
    playlistSongs: state => state.playlistSongs,
    playlistSongsCurrentItemIndex: (state, getters, rootState) =>
      state.playlistSongs.items.findIndex(item => (
        item.inPlaylistAs.index === rootState.player.item.inPlaylistAs.index
        && item.youtubeVideo._id === rootState.player.item.youtubeVideo._id
      )),
  },
  mutations: assign(fetchPlaylistSongs.mutations, addPlaylistSong.mutations, removePlaylistSong.mutations, movePlaylistSong.mutations, {
    [SONGS_MUTATION_SET_PLAYLIST_SONGS]: (state, playlistSongs) => assign(state.playlistSongs, playlistSongs),
    [SONGS_MUTATION_SET_PLAYLIST_SONGS_ITEMS]: (state, items) => assign(state.playlistSongs, { items }),
  }),
  actions: assign(fetchPlaylistSongs.actions, addPlaylistSong.actions, removePlaylistSong.actions, movePlaylistSong.actions, {
    [SONGS_ACTIONS_PLAY]: ({ dispatch }, item) => {
      if (item) {
        dispatch(PLAYER_SET_ITEM_ACTION, { itemIn: PLAYLIST, item })
      }

      dispatch(PLAYER_SET_PLAY_ACTION)

      dispatch(YOUTUBE_VIDEO_PLAYER_ACTIONS_PLAY)
    },
    [SONGS_ACTIONS_PAUSE]: ({ dispatch }) => {
      dispatch(PLAYER_SET_PAUSE_ACTION)

      dispatch(YOUTUBE_VIDEO_PLAYER_ACTIONS_PAUSE)
    },
    [SONGS_ACTIONS_PLAY_PREVIOUS]: ({ dispatch, state, getters, rootState }) => {
      const currentItemIndex = getters.playlistSongsCurrentItemIndex

      let nextItemIndex
      if (currentItemIndex > 0) {
        nextItemIndex = currentItemIndex - 1
      } else if (rootState.player.repeatAll) {
        nextItemIndex = state.playlistSongs.total - 1
      } else {
        nextItemIndex = currentItemIndex
      }

      if (nextItemIndex !== currentItemIndex) {
        const nextItem = state.playlistSongs.items[nextItemIndex]

        dispatch(PLAYER_SET_ITEM_ACTION, { itemIn: PLAYLIST, item: nextItem })

        if (rootState.player.play) {
          dispatch(YOUTUBE_VIDEO_PLAYER_ACTIONS_PLAY)
        }
      }
    },
    [SONGS_ACTIONS_PLAY_NEXT]: ({ dispatch, state, getters, rootState }) => {
      const currentItemIndex = getters.playlistSongsCurrentItemIndex

      let nextItemIndex
      if (currentItemIndex < state.playlistSongs.total - 1) {
        nextItemIndex = currentItemIndex + 1
      } else if (rootState.player.repeatAll) {
        nextItemIndex = 0
      } else {
        nextItemIndex = currentItemIndex
      }

      if (nextItemIndex !== currentItemIndex) {
        const nextItem = state.playlistSongs.items[nextItemIndex]

        dispatch(PLAYER_SET_ITEM_ACTION, { itemIn: PLAYLIST, item: nextItem })

        if (rootState.player.play) {
          dispatch(YOUTUBE_VIDEO_PLAYER_ACTIONS_PLAY)
        }
      }
    },
    [SONGS_ACTION_SHUFFLE_PLAYLIST_SONGS]: ({ state, commit }) => {
      const shuffledIndexes = shuffle(state.playlistSongs.total)

      const nextItems = shuffledIndexes.map(index => state.playlistSongs.items[index])

      commit(SONGS_MUTATION_SET_PLAYLIST_SONGS_ITEMS, nextItems)
    },
    [SONGS_ACTION_UNSHUFFLE_PLAYLIST_SONGS]: ({ state, commit }) => {
      const nextItems = state.playlistSongs.items.sort((prevItem, nextItem) => prevItem.inPlaylistAs.index > nextItem.inPlaylistAs.index)

      commit(SONGS_MUTATION_SET_PLAYLIST_SONGS_ITEMS, nextItems)
    },
  })
}
