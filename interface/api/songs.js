import gql from 'graphql-tag'
import { graphqlClient } from 'apollo'
import api from './'

const PLAYLIST_SONGS_QUERY = gql`
  query PlaylistSongs($playlistId: ID!) {
    playlistSongs(playlistId: $playlistId) {
      items {
        song {
          _id
          youtubeVideoId
        }
        inPlaylistAs {
          _id
          index
        }
      }
      total
    }
  }
`

const playlistSongsQuery = async playlistId => {
  const { data: { playlistSongs: { items, total } } } = await graphqlClient.query({
    query: PLAYLIST_SONGS_QUERY,
    variables: {
      playlistId,
    },
  })

  const extendedItems = []

  const youtubeVideoIds = items.map(item => item.song.youtubeVideoId)

  const { items: youtubeVideos } = await api.getVideos(youtubeVideoIds)

  items.forEach((playlistSong, i) => {
    extendedItems[i] = {
      ...playlistSong,
      youtubeVideo: youtubeVideos[i]
    }
  })

  return {
    items: extendedItems,
    total,
  }
}

const addPlaylistSongMutation = async ({ playlistId, youtubeVideoId, index }) => {
  const { data: { addPlaylistSong: { song, inPlaylistAs } } } = await graphqlClient.mutate({
    mutation: gql`
      mutation(
        $playlistId: ID!
        $youtubeVideoId: ID!
        $index: Int
      ) {
        addPlaylistSong(
          playlistId: $playlistId
          youtubeVideoId: $youtubeVideoId
          index: $index
        ) {
          song {
            _id
            youtubeVideoId
          }
          inPlaylistAs {
            _id
            index
          }
        }
      }
    `,
    variables: {
      playlistId,
      youtubeVideoId,
      index
    },
  })

  const { items: [youtubeVideo] } = await api.getVideos([song.youtubeVideoId])

  return {
    song,
    inPlaylistAs,
    youtubeVideo,
  }
}

export default {
  playlistSongsQuery,
  addPlaylistSongMutation,
}
