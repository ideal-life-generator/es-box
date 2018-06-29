<template lang="pug">
div.search
  input(v-model="input")
</template>

<script>
import { mapGetters } from 'vuex'
import { SEARCH_INPUT } from 'store/search'

export default {
  data: () => ({
    y: 10,
    x: 1,
    width: 250,
    height: 30,
    horisontalPadding: 10,
    verticalPadding: 5,
    iconSize: 20,
    iconPaddingRight: 7.5,
  }),
  computed: {
    input: {
      get() { return this.$store.state.search.input },
      set(value) { this.$store.dispatch(SEARCH_INPUT, value) },
    }
  }
}
</script>

<style lang="sass">
.search
  $height: 35px
  width: 500px
  height: $height
  display: flex
  border: 1px solid white
  border-radius: $height / 2

  input
    flex-grow: 1
    padding: 10px 10px
    border: 0
    outline: 0
    background: 0
    box-sizing: border-box
    color: white

</style>
