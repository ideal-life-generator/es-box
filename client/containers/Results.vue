<template lang="jade">
div.results
  ul.user-defined(v-if="songs && songs.user && songs.user.total")
    li(v-for="song in songs.user.items")
      p.title {{ song.title }}
  ul.user-defined(v-if="youtube.total")
    li(v-for="song in youtube.items")
      p.title {{ song.title }}
</template>

<script>
import { mapGetters } from 'vuex'
import Search from './Search.vue'
import { USER_DEFINED } from '../queries/songs'

export default {
  computed: {
    ...mapGetters({
      youtube: 'youtube',
    }),
  },
  components: {
    Search,
  },
  apollo: {
    songs: USER_DEFINED,
  },
}
</script>

<style lang="sass">
@import "../sass/variables.sass"
@import "../sass/mixins.sass"

.results
  flex-grow: 1
  border-radius: 0.5px
  .user-defined
    +border-neon(0.5px, $white)
    li
      height: 50px
      display: flex
      align-items: center
      .title
        color: $white
        text-overflow: ellipsis
        white-space: nowrap
        overflow: hidden
        +text-neon(0.5px, fade-out($white, 0.8))
</style>