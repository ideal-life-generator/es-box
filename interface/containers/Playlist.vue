<template lang="pug">
div.playlist
  video-item(
    v-for="(item, i) in videos.items"
    v-bind:key="`${item.id}-${i}`"
    v-bind="item"
  )
</template>

<script>
import { mapGetters } from 'vuex'
import gql from 'graphql-tag'
import api from 'api'
import VideoItem from './VideoItem.vue'
import { PLAYER_SET_ITEM_ACTION } from 'store/player'
import { UPDATE } from 'components/Counter.vue'
import bus from 'events-bus'

export default {
  data: () => ({
    playlist: {
      _id: null,
      name: '',
      ids: []
    },
    videos: [],
    currentItemId: null
  }),
  computed: {
    ...mapGetters([
      'player'
    ]),
    count() {
      return this.videos.items.length
    },
    currentItemIndex() {
      return this.videos.items.findIndex(item => this.currentItemId === item._id)
    }
  },
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

        if (this.playlist.ids.length > 0) {
          const [{ _id, title }] = this.videos.items

          this.$store.dispatch(PLAYER_SET_ITEM_ACTION, { _id, title })

          this.currentItemId = _id

          bus.$emit(YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID)
          bus.$emit(UPDATE, { current: this.currentItemIndex, count: this.count })
        }
      }
    }
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
