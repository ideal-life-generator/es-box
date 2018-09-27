import api from 'api'
import shuffle from 'utils/shuffle'

const { assign } = Object

export const SONGS_ACTION_FETCH_PLAYLIST_SONGS = 'SONGS_ACTION@FETCH_PLAYLIST_SONGS'
export const SONGS_ACTION_SHUFFLE_PLAYLIST_SONGS = 'SONGS_ACTION@SHUFFLE_PLAYLIST_SONGS'
export const SONGS_ACTION_UNSHUFFLE_PLAYLIST_SONGS = 'SONGS_ACTION@UNSHUFFLE_PLAYLIST_SONGS'

export const SONGS_MUTATION_PLAYLIST_SONGS_REQUEST = 'SONGS_MUTATION@PLAYLIST_SONGS_REQUEST'
export const SONGS_MUTATION_PLAYLIST_SONGS_SUCCESS = 'SONGS_MUTATION@PLAYLIST_SONGS_SUCCESS'
export const SONGS_MUTATION_SET_PROGRESSION = 'SONGS_MUTATION@SET_PROGRESSION'
export const SONGS_MUTATION_PLAYLIST_SONGS_FAILURE = 'SONGS_MUTATION@PLAYLIST_SONGS_FAILURE'
export const SONGS_MUTATION_SET_PLAYLIST_SONGS_ITEMS = 'SONGS_MUTATION@SET_PLAYLIST_SONGS_ITEMS'


export default {
  state: {
    playlistSongs: {
      items: [],
      total: null,
    },
    processing: false,
    error: null,
  },
  getters: {
    songs: state => state,
    playlistSongs: state => state.playlistSongs,
  },
  mutations: {
    [SONGS_MUTATION_PLAYLIST_SONGS_REQUEST]: state => assign(state, {
      error: null,
      processing: true,
    }),
    [SONGS_MUTATION_PLAYLIST_SONGS_SUCCESS]: (state, playlistSongs) => assign(state, {
      playlistSongs,
      processing: false,
    }),
    [SONGS_MUTATION_SET_PROGRESSION]: (state, processing) => assign(state, {
      processing,
    }),
    [SONGS_MUTATION_PLAYLIST_SONGS_FAILURE]: (state, error) => assign(state, {
      error,
      processing: false,
    }),
    [SONGS_MUTATION_SET_PLAYLIST_SONGS_ITEMS]: (state, items) => assign(state.playlistSongs, { items }),
  },
  actions: {
    [SONGS_ACTION_FETCH_PLAYLIST_SONGS]: async ({ rootState, dispatch, commit }, playlistId) => {
      try {
        commit(SONGS_MUTATION_PLAYLIST_SONGS_REQUEST)

        const playlistSongs = await api.playlistSongsQuery(playlistId)

        if (rootState.player.shuffle) {
          dispatch(SONGS_ACTION_SHUFFLE_PLAYLIST_SONGS, playlistSongs)

          commit(SONGS_MUTATION_SET_PROGRESSION, false)
        } else {
          commit(SONGS_MUTATION_PLAYLIST_SONGS_SUCCESS, playlistSongs)
        }
      } catch (error) {
        console.log(error)

        commit(SONGS_MUTATION_PLAYLIST_SONGS_FAILURE, error)
      }
    },
    [SONGS_ACTION_SHUFFLE_PLAYLIST_SONGS]: ({ state, commit }) => {
      const shuffledIndexes = shuffle(state.playlistSongs.total)

      const nextItems = shuffledIndexes.map(index => state.playlistSongs.items[index])

      commit(SONGS_MUTATION_SET_PLAYLIST_SONGS_ITEMS, nextItems)
    },
    [SONGS_ACTION_UNSHUFFLE_PLAYLIST_SONGS]: ({ state, commit }) => {
      const nextItems = state.playlistSongs.items.sort((prevItem, nextItem) => prevItem.inPlaylistAs.index > nextItem.inPlaylistAs.index)

      console.log(nextItems)

      commit(SONGS_MUTATION_SET_PLAYLIST_SONGS_ITEMS, nextItems)
    },
  }
}
