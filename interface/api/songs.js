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

export default {
  playlistSongsQuery
}
