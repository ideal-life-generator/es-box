<template lang="pug">
div.content
  search-results(v-bind:x="size.resultsX" v-bind:y="size.resultsY")
</template>

<script>
import { mapGetters } from 'vuex'
import SearchResults from './SearchResults.vue'

export default {
  computed: {
    ...mapGetters([
      'size'
    ])
  },
  components: {
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
