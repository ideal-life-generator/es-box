<template lang="pug">
div.song
  div.title(v-text="title")
</template>

<script>
import { mapGetters } from 'vuex'
import { search } from 'store/search-results'
import VideoPlayer from 'components/VideoPlayer.vue'
import PlusIcon from 'components/icons/Plus.vue'
import {
  PLAYER_PLAYBACK_MUTATION,
  PLAYER_SET_ITEM_ACTION,
  PLAY_ACTION
} from 'store/player'
import bus from 'events-bus'

export default {
  props: {
    _id: { type: String, required: true },
    sourceId: { type: String, required: true },
    title: { type: String, required: true },
    // duration: { type: String, required: true }
  },
  methods: {
    onUnstarted() {
      const { _id, title } = this

      this.$store.dispatch(PLAY_ACTION, { _id, title })
    },
    onPlaying() {
      const { _id, title } = this

      this.$store.dispatch(PLAY_ACTION, { _id, title })

      bus.$emit('stop', this.$store.state.player._id)
    },
    onPaused() {
      if (this.$store.state.player._id === this._id) {
        this.$store.commit(PLAYER_PLAYBACK_MUTATION, false)
      }
    },
    onEnded() {
      this.$store.commit(PLAYER_PLAYBACK_MUTATION, false)

      // bus.$emit('player@next')
    },
    addItem() {
      const { sourceId, title } = this

      this.$store.dispatch('new-playlist@add-item', { sourceId, title })
    }
  },
  components: {
    VideoPlayer,
    PlusIcon
  }
}
</script>

<style lang="sass">
@import '../styles/theme.sass'

.song
  height: 35px
  display: flex

  .title
    fill: $primary-color2

  .playback
    user-select: none
    cursor: pointer

  .youtube-player-container
    width: 265px
    height: 150px

  .play-icon
    margin-left: auto

</style>
