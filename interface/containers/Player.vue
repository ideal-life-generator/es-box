<template lang="pug">
div.player
  play(v-if="!player.play" v-bind:size="25")
  pause(v-else v-bind:size="25")
  div.title(v-text="player.title")
</template>

<script>
import { mapGetters } from 'vuex'
import Play from 'components/icons/Play.vue'
import Pause from 'components/icons/Pause.vue'
import { PLAYER_CLEAR_ACTION } from 'store/player'

export default {
  computed: {
    ...mapGetters([
      'player'
    ]),
  },
  mounted() {
    this.$store.dispatch(PLAYER_CLEAR_ACTION)
  },
  components: {
    Play,
    Pause
  }
}
</script>

<style lang="sass">
.player
  display: flex

  .title
    // position: absolute
    color: white

</style>
