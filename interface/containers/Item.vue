<template lang="pug">
div.song(v-bind:class="{ active }")
  play-icon.play(
    v-if="playing"
    v-bind:size="21"
    v-on:click.native="onPlay"
  )
  pause-icon.pause(
    v-else
    v-bind:size="21"
    v-on:click.native="onPause"
  )
  div.title(v-text="title")
</template>

<script>
import { mapGetters } from 'vuex'
import { search } from 'store/search-results'
import VideoPlayer from 'components/VideoPlayer.vue'
import PlayIcon from 'components/icons/Play.vue'
import PauseIcon from 'components/icons/Pause.vue'
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
    playing: { type: Boolean, required: true },
    active: { type: Boolean, required: true }
    // duration: { type: String, required: true }
  },
  methods: {
    onPlay() {
      this.$emit('play', {
        _id: this._id,
        sourceId: this.sourceId,
        title: this.title
      })
    },
    onPause() {
      this.$emit('pause', {
        _id: this._id,
        sourceId: this.sourceId,
        title: this.title
      })
    },
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
    PlayIcon,
    PauseIcon
  }
}
</script>

<style lang="sass">
@import '../styles/theme.sass'

.song
  height: 35px
  display: grid
  grid-template-areas: 'play title'
  grid-template-columns: 35px auto

  .play
    grid-area: play
    display: flex
    justify-content: center
    align-items: center

  .title
    grid-area: title
    display: flex
    align-items: center

  .playback
    user-select: none
    cursor: pointer

  .youtube-player-container
    width: 265px
    height: 150px

  .play-icon
    margin-left: auto

  &.active
    .title
      color: purple

</style>
