import api from 'api'
import shuffle from 'utils/shuffle'
import createAsyncAction from './utils/create-async-action'

const { assign } = Object

export const SONGS_MUTATION_SET_PLAYLIST_SONGS = 'SONGS_MUTATION@SET_PLAYLIST_SONGS'
export const SONGS_MUTATION_SET_PLAYLIST_SONGS_ITEMS = 'SONGS_MUTATION@SET_PLAYLIST_SONGS_ITEMS'

export const SONGS_ACTION_SHUFFLE_PLAYLIST_SONGS = 'SONGS_ACTION@SHUFFLE_PLAYLIST_SONGS'
export const SONGS_ACTION_UNSHUFFLE_PLAYLIST_SONGS = 'SONGS_ACTION@UNSHUFFLE_PLAYLIST_SONGS'

export const fetchPlaylistSongs = createAsyncAction('SONGS@FETCH_PLAYLIST_SONGS', async ({ rootState, dispatch, commit }, playlistId) => {
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

export const addPlaylistSong = createAsyncAction('SONGS@ADD_PLAYLIST_SONG', async ({ state, commit }, { playlistId, youtubeVideoId, index }) => {
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

    commit(SONGS_MUTATION_SET_PLAYLIST_SONGS, nextPlaylistSongs)
  } catch (error) {
    console.log(error)

    throw (error && error.graphQLErrors && error.graphQLErrors[0] && error.graphQLErrors[0].message)
      ? error.graphQLErrors[0].message : error
  }
}, {
  progressingKey: 'adding',
  errorKey: 'addingError'
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
  },
  mutations: assign(fetchPlaylistSongs.mutations, addPlaylistSong.mutations, {
    [SONGS_MUTATION_SET_PLAYLIST_SONGS]: (state, playlistSongs) => assign(state.playlistSongs, playlistSongs),
    [SONGS_MUTATION_SET_PLAYLIST_SONGS_ITEMS]: (state, items) => assign(state.playlistSongs, { items }),
  }),
  actions: assign(fetchPlaylistSongs.actions, addPlaylistSong.actions, {
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
