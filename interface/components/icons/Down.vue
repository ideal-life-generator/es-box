<template lang="pug">
icon(v-bind:x="x" v-bind:y="y" v-bind:size="size")
  g(v-bind:fill="color")
    path(d="M512 256c0-141.385-114.615-256-256-256s-256 114.615-256 256 114.615 256 256 256 256-114.615 256-256zM48 256c0-114.875 93.125-208 208-208s208 93.125 208 208-93.125 208-208 208-208-93.125-208-208z")
    path(d="M158.628 177.372l-45.256 45.256 142.628 142.627 142.627-142.628-45.254-45.254-97.373 97.372z")
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
