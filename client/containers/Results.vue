<template lang="jade">
div.results
  ul.user-defined(v-if="songs && songs.userDefined && songs.userDefined.count")
    li(v-for="song in songs.userDefined.collection") {{ song.artist }} - {{ song.title }}
</template>

<script>
import Search from './Search.vue'
import { USER_DEFINED } from '../queries/songs'

export default {
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
  width: 375px
  margin: 15px
  padding: 15px
  border-radius: 0.5px
  .user-defined
    li
      height: 50px
      display: flex
      align-items: center
      color: $white
      +text-neon(0.5px, fade-out($white, 0.8))
</style>