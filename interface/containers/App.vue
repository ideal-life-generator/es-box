<template lang="pug">
svg.content
  search
  search-results(v-bind:x="size.resultsX" v-bind:y="size.resultsY")
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

text
  dominant-baseline: hanging

.content
  flex-grow: 1

</style>
