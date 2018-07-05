<template lang="pug">
icon(v-bind:x="x" v-bind:y="y" v-bind:size="size")
  g(v-bind:fill="color")
    polygon(points="106.667,106.667 320,106.667 320,170.667 405.333,85.333 320,0 320,64 64,64 64,192 106.667,192")
    polygon(points="234.667,277.333 234.667,149.333 213.333,149.333 170.667,170.667 170.667,192 202.667,192 202.667,277.333")
    polygon(points="320,320 106.667,320 106.667,256 21.333,341.333 106.667,426.667 106.667,362.667 362.667,362.667 362.667,234.667 320,234.667")
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
Z