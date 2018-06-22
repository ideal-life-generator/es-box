<template lang="pug">
svg.search
  rect(v-bind:x="x" v-bind:y="y" rx="15" ry="15" v-bind:width="width" v-bind:height="height" style="fill: none; stroke: red; stroke-width: 1;")
  svg(v-bind:x="x + width - iconSize - iconPaddingRight" v-bind:y="y + (height - iconSize) / 2" v-bind:width="iconSize" v-bind:height="iconSize" fill="none" stroke="red" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg")
    circle(cx="10.5" cy="10.5" r="7.5")
    line(x1="21" x2="15.8" y1="21" y2="15.8")
  foreignObject(v-bind:x="x" v-bind:y="y" v-bind:width="width" v-bind:height="height")
    input(v-model="input" v-bind:style="{ padding: `${verticalPadding}px ${horisontalPadding + iconSize + iconPaddingRight}px ${verticalPadding}px ${horisontalPadding}px`, width: `${width}px`, height: `${height}px` }")
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
  input
    border: 0
    outline: 0
    background: 0
    box-sizing: border-box
    color: white

</style>
