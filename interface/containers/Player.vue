<template lang="pug">
div.player
  previous(
    v-bind:size="25"
    v-on:click.native="previous"
    v-bind:disabled="!isPreviousAvailable"
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
    v-bind:disabled="!isNextAvailable"
  )
  shuffle(
    v-bind:color="player.shuffle ? 'white' : 'gray'"
    v-bind:size="20"
    v-on:click.native="onShuffle"
  )
  repeat-one(
    v-bind:color="player.repeatOne ? 'white' : 'gray'"
    v-bind:size="25"
    v-on:click.native="onRepeatOne"
  )
  repeat-all(
    v-bind:color="player.repeatAll ? 'white' : 'gray'"
    v-bind:size="20"
    v-on:click.native="onRepeatAll"
  )
  div.title(v-text="player.item && player.item.youtubeVideo.title")
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
  SEARCH_RESULTS,
  PLAYER_PLAYBACK_MUTATION,
  PLAYER_SET_ITEM_ACTION,
  PLAYER_PLAY_ACTION,
  PLAYER_PAUSE_ACTION,
  PLAYER_PREVIOUS_ACTION,
  PLAYER_NEXT_ACTION,
  PLAYER_CLEAR_ACTION,
  PLAYER_TOGGLE_SHUFFLE_ACTION,
  PLAYER_TOGGLE_REPEAT_ONE_ACTION,
  PLAYER_TOGGLE_REPEAT_ALL_ACTION
} from 'store/player'
import {
  LOAD_MORE_ACTION,
  SEARCH_RESULTS_ACTIONS_PLAY_PREVIOUS,
  SEARCH_RESULTS_ACTIONS_PLAY_NEXT,
} from 'store/search-results'
import {
  YOUTUBE_VIDEO_PLAYER_PLAY,
  YOUTUBE_VIDEO_PLAYER_PAUSE,
  YOUTUBE_VIDEO_PLAYER_PLAYING,
  YOUTUBE_VIDEO_PLAYER_ENDED,
  YOUTUBE_VIDEO_PLAYER_SET_VIDEO_ID,
  YOUTUBE_VIDEO_PLAYER_CUET_VIDEO_ID,
  YOUTUBE_VIDEO_PLAYER_SET_AND_PLAY,
} from 'containers/YoutubeVideo.vue'
import bus from 'events-bus'

export const PLAYER_SET_ITEM = 'PLAYER@SET_ITEM'
export const PLAYER_ON_SET_ITEM = 'PLAYER@ON_SET_ITEM'
export const PLAYER_PLAY = 'PLAYER@PLAY'
export const PLAYER_ON_PLAY = 'PLAYER@ON_PLAY'
export const PLAYER_PAUSE = 'PLAYER@PAUSE'
export const PLAYER_ON_PAUSE = 'PLAYER@ON_PAUSE'
export const PLAYER_PREVIOUS = 'PLAYER@PREVIOUS'
export const PLAYER_ON_PREVIOUS = 'PLAYER@ON_PREVIOUS'
export const PLAYER_NEXT = 'PLAYER@NEXT'
export const PLAYER_ON_NEXT = 'PLAYER@ON_NEXT'
export const PLAYER_ON_SHUFFLE = 'PLAYER@ON_SHUFFLE'

export default {
  computed: {
    ...mapGetters([
      'player',
      'searchResults',
      'counter',
      'searchResultsCurrentItemIndex'
    ]),
    _id() {
      return this.$store.state.player._id
    },
    isPreviousAvailable() {
      if (!this.player.repeatAll) {
        if (this.player.itemIn === SEARCH_RESULTS) {
          return this.searchResultsCurrentItemIndex > 0
        }
      } else {
        return true
      }
    },
    isNextAvailable() {
      if (!this.player.repeatAll) {
        if (this.player.itemIn === SEARCH_RESULTS) {
          return this.searchResultsCurrentItemIndex < this.searchResults.total - 1
        }
      } else {
        return true
      }
    },
  },
  methods: {
    play() {
      this.$store.dispatch(PLAYER_PLAY_ACTION)
    },
    pause() {
      this.$store.dispatch(PLAYER_PAUSE_ACTION)
    },
    previous() {
      this.$store.dispatch(PLAYER_PREVIOUS_ACTION)
    },
    next() {
      this.$store.dispatch(PLAYER_NEXT_ACTION)
    },
    onShuffle() {
      this.$store.dispatch(PLAYER_TOGGLE_SHUFFLE_ACTION)

      bus.$emit(PLAYER_ON_SHUFFLE)
    },
    onRepeatOne() {
      this.$store.dispatch(PLAYER_TOGGLE_REPEAT_ONE_ACTION)
    },
    onRepeatAll() {
      this.$store.dispatch(PLAYER_TOGGLE_REPEAT_ALL_ACTION)
    },
    [PLAYER_SET_ITEM](item) {
      this.$store.dispatch(PLAYER_SET_ITEM_ACTION, item)

      bus.$emit(PLAYER_ON_SET_ITEM, item._id)
    },
    onYoutubeVideoPlayerPlay() {
      this.$store.commit(PLAYER_PLAYBACK_MUTATION, true)
    },
    onYoutubeVideoPlayerPaused(item, _id) {
      if (_id === this.player.item.youtubeVideo._id) {
        this[PLAYER_PAUSE]()
      }
    },
    onYoutubeVideoPlayerEnded() {
      if (!this.player.repeatOne) {
        this[PLAYER_NEXT]()
      } else {
        this[PLAYER_PLAY]()
      }
    }
  },
  mounted() {
    this.$store.commit(PLAYER_PLAYBACK_MUTATION, false)

    bus.$on(PLAYER_SET_ITEM, this[PLAYER_SET_ITEM])
    bus.$on(PLAYER_PLAY, this[PLAYER_PLAY])
    bus.$on(PLAYER_PAUSE, this[PLAYER_PAUSE])
    bus.$on(PLAYER_PREVIOUS, this[PLAYER_PREVIOUS])
    bus.$on(PLAYER_NEXT, this[PLAYER_NEXT])
    bus.$on(YOUTUBE_VIDEO_PLAYER_PLAYING, this.onYoutubeVideoPlayerPlay)
    bus.$on(YOUTUBE_VIDEO_PLAYER_PAUSE, this.onYoutubeVideoPlayerPaused)
    bus.$on(YOUTUBE_VIDEO_PLAYER_ENDED, this.onYoutubeVideoPlayerEnded)
  },
  unmounted() {
    bus.$off(PLAYER_SET_ITEM, this[PLAYER_SET_ITEM])
    bus.$off(PLAYER_PLAY, this[PLAYER_PLAY])
    bus.$off(PLAYER_PAUSE, this[PLAYER_PAUSE])
    bus.$off(PLAYER_PREVIOUS, this[PLAYER_PREVIOUS])
    bus.$off(PLAYER_NEXT, this[PLAYER_NEXT])
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
