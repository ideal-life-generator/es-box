<template lang="pug">
div.player
  previous(
    v-bind:size="25"
    v-on:click.native="previous"
    v-bind:disabled="counter.current <= 0"
  )
  play(
    v-if="!player.play"
    v-bind:size="25"
    v-on:click.native="play"
  )
  pause(
    v-else
    v-bind:size="25"
    v-on:click.native="pause"
  )
  next(
    v-bind:size="25"
    v-on:click.native="next"
  )
  shuffle(
    v-bind:color="player.shuffle ? 'white' : 'gray'"
    v-bind:size="20"
  )
  repeat-one(
    v-bind:color="player.repeatOne ? 'white' : 'gray'"
    v-bind:size="25"
    v-on:click.native="repeatOne"
  )
  repeat-all(
    v-bind:color="player.repeatAll ? 'white' : 'gray'"
    v-bind:size="20"
    v-on:click.native="repeatAll"
  )
  div.title(v-text="player.title")
</template>

<script>
import { mapGetters } from 'vuex'
import Play from 'components/icons/Play.vue'
import Pause from 'components/icons/Pause.vue'
import Previous from 'components/icons/Previous.vue'
import Next from 'components/icons/Next.vue'
import RepeatOne from 'components/icons/RepeatOne.vue'
import RepeatAll from 'components/icons/RepeatAll.vue'
import Shuffle from 'components/icons/Shuffle.vue'
import {
  PLAYER_PLAYBACK_MUTATION,
  PLAYER_SET_ITEM_ACTION,
  PLAYER_CLEAR_ACTION,
  PLAYER_TOGGLE_REPEAT_ONE_ACTION,
  PLAYER_TOGGLE_REPEAT_ALL_ACTION
} from 'store/player'
import { LOAD_MORE_ACTION } from 'store/search-results'
import {
  YOUTUBE_VIDEO_PLAYER_PLAYING,
  YOUTUBE_VIDEO_PLAYER_PAUSED,
  YOUTUBE_VIDEO_PLAYER_ENDED
} from 'containers/YoutubeVideo.vue'
import bus from 'events-bus'

export const PLAYER_PLAY = 'PLAYER@PLAY'
export const PLAYER_PAUSE = 'PLAYER@PAUSE'
export const PLAYER_PREVIOUS = 'PLAYER@PREVIOUS'
export const PLAYER_NEXT = 'PLAYER@NEXT'

export default {
  computed: {
    ...mapGetters([
      'player',
      'searchResults',
      'counter'
    ]),
    _id() {
      return this.$store.state.player._id
    }
  },
  methods: {
    play() {
      this.$store.commit(PLAYER_PLAYBACK_MUTATION, true)

      bus.$emit(PLAYER_PLAY, this._id)
    },
    pause() {
      this.$store.commit(PLAYER_PLAYBACK_MUTATION, false)

      bus.$emit(PLAYER_PAUSE, this._id)
    },
    previous() {
      bus.$emit(PLAYER_PREVIOUS)
    },
    next() {
      bus.$emit(PLAYER_NEXT)
    },
    repeatOne() {
      this.$store.dispatch(PLAYER_TOGGLE_REPEAT_ONE_ACTION)
    },
    repeatAll() {
      this.$store.dispatch(PLAYER_TOGGLE_REPEAT_ALL_ACTION)
    },
    onYoutubeVideoPlayerPlay() {
      this.$store.commit(PLAYER_PLAYBACK_MUTATION, true)
    },
    onYoutubeVideoPlayerPaused(_id) {
      if (_id === this._id) {
        this.$store.commit(PLAYER_PLAYBACK_MUTATION, false)
      }
    },
    onYoutubeVideoPlayerEnded() {
      if (!this.player.repeatOne) {
        this.next()
      } else {
        this.play()
      }
    }
  },
  mounted() {
    this.$store.dispatch(PLAYER_CLEAR_ACTION)

    bus.$on(YOUTUBE_VIDEO_PLAYER_PLAYING, this.onYoutubeVideoPlayerPlay)
    bus.$on(YOUTUBE_VIDEO_PLAYER_PAUSED, this.onYoutubeVideoPlayerPaused)
    bus.$on(YOUTUBE_VIDEO_PLAYER_ENDED, this.onYoutubeVideoPlayerEnded)
  },
  unmounted() {
    bus.$off(YOUTUBE_VIDEO_PLAYER_PLAYING, this.onYoutubeVideoPlayerPlay)
    bus.$off(YOUTUBE_VIDEO_PLAYER_PAUSED, this.onYoutubeVideoPlayerPaused)
    bus.$off(YOUTUBE_VIDEO_PLAYER_ENDED, this.onYoutubeVideoPlayerEnded)
  },
  components: {
    Play,
    Pause,
    Previous,
    Next,
    RepeatOne,
    RepeatAll,
    Shuffle
  }
}
</script>

<style lang="sass">
.player
  display: flex
  height: 25px
  user-select: none

  .title
    // position: absolute
    color: white

  .counter
    margin-left: auto
    margin-right: 15px

</style>
