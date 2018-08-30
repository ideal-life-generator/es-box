<template lang="pug">
icon(v-bind:x="x" v-bind:y="y" v-bind:size="size")
  g(v-bind:fill="color")
    path(d="M512 512h-208l80-80-96-96 48-48 96 96 80-80zM176 224l-96-96-80 80v-208h208l-80 80 96 96z")
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
