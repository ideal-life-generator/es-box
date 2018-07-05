<template lang="pug">
div.player
  previous(
    v-bind:size="25"
    v-on:click.native="onPrevious"
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
  div.title(v-text="player.title")
</template>

<script>
import { mapGetters } from 'vuex'
import Play from 'components/icons/Play.vue'
import Pause from 'components/icons/Pause.vue'
import Previous from 'components/icons/Previous.vue'
import Next from 'components/icons/Next.vue'
import RepeatOne from 'components/icons/RepeatOne.vue'
import {
  PLAYER_PLAY_ACTION,
  PLAYER_CLEAR_ACTION,
  PLAYER_TOGGLE_REPEAT_ONE_ACTION,
  PLAYER_PLAYBACK_MUTATION
} from 'store/player'
import { LOAD_MORE_ACTION } from 'store/search-results'
import bus from 'events-bus'

export default {
  computed: {
    ...mapGetters([
      'player'
    ]),
  },
  methods: {
    onPlay() {
      this.$store.commit(PLAYER_PLAYBACK_MUTATION, true)

      bus.$emit('player@play', this.player._id)
    },
    onPause() {
      this.$store.commit(PLAYER_PLAYBACK_MUTATION, false)

      bus.$emit('player@pause', this.player._id)
    },
    onPrevious() {
      const { items, count, total } = this.$store.state.searchResults

      const currentIndex = items.findIndex(item => this.player._id === item._id)

      let nextIndex
      if (currentIndex > 0) {
        nextIndex = currentIndex - 1
      } else {
        nextIndex = total
      }

      const { [nextIndex]: { _id, title } } = items

      this.$store.dispatch(PLAYER_PLAY_ACTION, { _id, title })

      bus.$emit('player@previous')
    },
    async onNext() {
      const { items, count, total } = this.$store.state.searchResults

      const currentIndex = items.findIndex(item => this.player._id === item._id)

      let nextIndex
      if (currentIndex < total) {
        if (currentIndex >= count - 1) {
          await this.$store.dispatch(LOAD_MORE_ACTION)
        }

        nextIndex = currentIndex + 1
      } else {
        nextIndex = 0
      }

      const { items: { [nextIndex]: nextItem } } = this.$store.state.searchResults

      if (nextItem) {
        const { _id, title } = nextItem

        this.$store.dispatch(PLAYER_PLAY_ACTION, { _id, title })

        bus.$emit('player@next')
      }
    },
    onRepeatOne() {
      this.$store.dispatch(PLAYER_TOGGLE_REPEAT_ONE_ACTION)
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
    this.$store.dispatch(PLAYER_CLEAR_ACTION)

    bus.$on('youtube-video@ended', this.onEnded)
  },
  unmounted() {
    bus.$off('youtube-video@ended', this.onEnded)
  },
  components: {
    Play,
    Pause,
    Previous,
    Next,
    RepeatOne
  }
}
</script>

<style lang="sass">
.player
  display: flex
  user-select: none

  .title
    // position: absolute
    color: white

</style>
