<template lang="jade">
icon(v-bind:x="x" v-bind:y="y" v-bind:size="size")
  g(
    fill="none"
    v-bind:stroke="color"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.5"
  )
    line(x1="12" x2="12" y1="5" y2="19")
    line(x1="5" x2="19" y1="12" y2="12")
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
