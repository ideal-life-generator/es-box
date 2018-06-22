<template lang="pug">
icon(v-bind:x="x" v-bind:y="y" v-bind:size="size")
  g(
    fill="none"
    v-bind:stroke="color"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.5"
  )
   polyline(points="20 6 9 17 4 12")
</template>

<script>
import Icon from './utils/Icon.vue'

export default {
  props: {
    x: { type: Number },
    y: { type: Number },
    size: { type: Number, required: true },
    color: { type: String, default: 'white' }
  },
  components: {
    Icon
  }
}
</script>

<style lang="sass">
</style>
