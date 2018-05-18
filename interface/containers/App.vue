<template lang="jade">
  svg.content
    text(v-text="size.resultsX")
    svg(v-bind:x="size.leftPanelX" v-bind:y="size.leftPanelY")
      svg.menu
        text Playlists
    svg(v-bind:x="size.resultsX" v-bind:y="size.resultsY")
      search
      search-results()
</template>

<script>
import { mapGetters } from 'vuex'
import Search from './Search.vue'
import SearchResults from './SearchResults/index.vue'

export default {
  computed: {
    ...mapGetters([
      'size'
    ])
  },
  components: {
    Search,
    SearchResults
  }
}
</script>

<style lang="sass">
@import '../styles/fonts.sass'
@import '../styles/theme.sass'

body
  font-family: 'Open Sans', sans-serif

.content
  flex-grow: 1

</style>
