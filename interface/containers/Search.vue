<template lang="pug">
label.search(
  v-on:click="onFocus"
)
  input.input(v-model="input")
  search.icon(
    v-bind:size="20"
  )
  search-results.results(v-show="focused")
</template>

<script>
import { mapGetters } from 'vuex'
import { SEARCH_INPUT } from 'store/search'
import Search from 'components/icons/Search.vue'
import SearchResults from 'containers/SearchResults.vue'

export default {
  data: () => ({
    focused: false
  }),
  computed: {
    input: {
      get() { return this.$store.state.search.input },
      set(value) { this.$store.dispatch(SEARCH_INPUT, value) },
    }
  },
  methods: {
    onFocus() {
      event.stopPropagation()

      if (!this.focused) {
        this.focused = true
      }
    },
    onBlur() {
      this.focused = false
    }
  },
  mounted() {
    window.addEventListener('click', this.onBlur)
  },
  unmounted() {
    window.removeEventListener('click', this.onBlur)
  },
  components: {
    Search,
    SearchResults
  }
}
</script>

<style lang="sass">
.search
  $height: 35px
  width: 500px
  height: $height
  display: grid
  grid-template-areas: 'input icon' 'results results'
  grid-template-columns: auto 30px
  grid-template-rows: 35px 500px
  border: 1px solid white
  border-radius: $height / 2

  .input
    flex-grow: 1
    padding: 10px 10px
    grid-area: input
    border: 0
    outline: 0
    background: 0
    box-sizing: border-box
    color: white

  .icon
    grid-area: icon

  .results
    margin-top: 2px
    grid-area: results

</style>
