<template lang="pug">
div.item
  //- video-player(
  //-   v-bind:_id="_id"
  //-   v-bind:sourceId="sourceId"
  //-   @unstarted="onUnstarted"
  //-   @playing="onPlaying"
  //-   @paused="onPaused"
  //-   @ended="onEnded"
  //- )
  div.content
    div.title(v-text="title")
    //- svg(v-if="!play" v-on:click="emitPlay(true)" x="29" y="25" width="35" height="35" class="playback" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg")
    //-   polygon(points="5 3 19 12 5 21 5 3" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5")
    //-   rect(width="24" height="24" fill="transparent" stroke="none")
    //- svg(v-else v-on:click="emitPlay(false)" x="29" y="25" width="35" height="35" class="playback" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg")
    //-   rect(x="5" y="3" width="4" height="18" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5")
    //-   rect(x="15" y="3" width="4" height="18" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5")
    //-   rect(width="24" height="24" fill="transparent" stroke="none")
    line.separator(x1="45px" y1="123" x2="100%" y2="123")
    plus-icon(
      v-bind:x="1100"
      v-bind:y="20"
      v-bind:size="31"
      color="white"
      @click.native="addItem"
    )
</template>

<script>
import { mapGetters } from 'vuex'
import { search } from 'store/search-results'
import VideoPlayer from 'components/VideoPlayer.vue'
import PlusIcon from 'components/icons/Plus.vue'
import {
  PLAYBACK_MUTATION,
  SET_ITEM_ACTION,
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
        this.$store.commit(PLAYBACK_MUTATION, false)
      }
    },
    onEnded() {
      this.$store.commit(PLAYBACK_MUTATION, false)

      bus.$emit('player@next')
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

.item
  height: 35px
  display: flex

  .content

    .title
      fill: $primary-color2

    .playback
      user-select: none
      cursor: pointer

    .youtube-player-container
      width: 265px
      height: 150px

    .separator
      flex-grow: 1
      stroke: black
      stroke-width: 1
      stroke: $primary-color2

</style>
