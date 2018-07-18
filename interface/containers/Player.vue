<template lang="pug">
div.player
  previous(
    v-bind:size="25"
    v-on:click.native="onPrevious"
    v-bind:disabled="searchResults.currentIndex <= 0"
  )
  play(
    v-if="!player.play"
    v-bind:size="25"
    v-on:click.native="onPlay"
  )
  pause(
    v-else
    v-bind:size="25"
    v-on:click.native="onPause"
  )
  next(
    v-bind:size="25"
    v-on:click.native="onNext"
  )
  repeat-one(
    v-bind:color="player.repeatOne ? 'white' : 'gray'"
    v-bind:size="25"
    v-on:click.native="onRepeatOne"
  )
  shuffle(
    v-bind:color="player.shuffle ? 'white' : 'gray'"
    v-bind:size="20"
  )
  repeat(
    v-bind:color="player.repeat ? 'white' : 'gray'"
    v-bind:size="20"
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
import Repeat from 'components/icons/Repeat.vue'
import Shuffle from 'components/icons/Shuffle.vue'
import {
  PLAYER_SET_ITEM_ACTION,
  CLEAR_ACTION,
  TOGGLE_REPEAT_ONE_ACTION,
  PLAYER_PLAYBACK_MUTATION
} from 'store/player'
import { LOAD_MORE_ACTION } from 'store/search-results'
import {
  YOUTUBE_VIDEO_PLAYER_PLAYING,
  YOUTUBE_VIDEO_PLAYER_PAUSED,
  YOUTUBE_VIDEO_PLAYER_ENDED
} from 'containers/YoutubeVideo.vue'
import bus from 'events-bus'

export const PLAYER_PLAY = 'PLAYER@PLAY'
export const PLAYER_NEXT = 'PLAYER@NEXT'

export default {
  computed: {
    ...mapGetters([
      'player',
      'searchResults'
    ]),
  },
  methods: {
    setPlay() {
      this.$store.commit(PLAYER_PLAYBACK_MUTATION, true)
    },
    onPlay() {
      this.setPlay()

      bus.$emit(PLAYER_PLAY, this.player._id)
    },
    onPause() {
      this.$store.commit(PLAYER_PLAYBACK_MUTATION, false)

      bus.$emit('player@pause', this.player._id)
    },
    onPrevious() {
      const { items, count, total, currentIndex } = this.$store.state.searchResults

      let nextIndex
      if (currentIndex > 0) {
        nextIndex = currentIndex - 1
      } else {
        nextIndex = total
      }

      const { [nextIndex]: { _id, title } } = items

      this.$store.dispatch(PLAYER_SET_ITEM_ACTION, { _id, title })

      bus.$emit('player@previous')
    },
    onNext() {
      bus.$emit(PLAYER_NEXT)
    },
    onRepeatOne() {
      this.$store.dispatch(TOGGLE_REPEAT_ONE_ACTION)
    },
    onEnded() {
      if (!this.player.repeatOne) {
        this.onNext()
      } else {
        this.onPlay()
      }
    }
  },
  mounted() {
    this.$store.dispatch(CLEAR_ACTION)

    bus.$on(YOUTUBE_VIDEO_PLAYER_PLAYING, this.setPlay)
    bus.$on(YOUTUBE_VIDEO_PLAYER_PAUSED, this.onPause)
    bus.$on(YOUTUBE_VIDEO_PLAYER_ENDED, this.onEnded)
  },
  unmounted() {
    bus.$off(YOUTUBE_VIDEO_PLAYER_PLAYING, this.setPlay)
    bus.$off(YOUTUBE_VIDEO_PLAYER_PAUSED, this.onPause)
    bus.$off(YOUTUBE_VIDEO_PLAYER_ENDED, this.onEnded)
  },
  components: {
    Play,
    Pause,
    Previous,
    Next,
    RepeatOne,
    Repeat,
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
