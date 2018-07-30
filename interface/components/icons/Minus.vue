<template lang="pug">
icon(v-bind:x="x" v-bind:y="y" v-bind:size="size")
  g(v-bind:fill="color")
    path(d="M0 208v96c0 8.836 7.164 16 16 16h480c8.836 0 16-7.164 16-16v-96c0-8.836-7.164-16-16-16h-480c-8.836 0-16 7.164-16 16z")
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