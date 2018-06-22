<template lang="pug">
svg.playlist
  text(v-text="playlist.name")
  video-item(
    v-for="(item, i) in videos.items"
    v-bind:key="`${item.id}-${i}`"
    v-bind:height="itemHeight"
    v-bind:y="30 + itemHeight * i"
    v-bind:playerX="size.mainX + size.resultsX"
    v-bind:playerY="size.mainY + size.resultsY + (itemHeight * i)"
    v-bind="item"
  )
</template>

<script>
import { mapGetters } from 'vuex'
import gql from 'graphql-tag'
import api from 'api'
import VideoItem from './VideoItem.vue'

export default {
  data: () => ({
    playlist: {
      _id: null,
      name: '',
      ids: []
    },
    videos: [],
    itemHeight: 145.5
  }),
  apollo: {
    playlist: {
      query: gql`
        query Playlist($key: String!) {
          playlist(key: $key) {
            _id
            name
            ids
          }
        }
      `,
      variables() {
        return {
          key: this.$route.params.key,
        }
      },
      async result({ data: { playlist: { ids } } }) {
        this.videos = await api.getVideos(ids)
      }
    }
  },
  computed: {
    ...mapGetters([
      'size'
    ])
  },
  components: {
    VideoItem
  }
}
</script>

<style lang="sass">
text
  fill: white

</style>
