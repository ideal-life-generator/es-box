<template lang="pug">
icon(v-bind:x="x" v-bind:y="y" v-bind:size="size")
  path(
    d="M64 160h320v96l128-128-128-128v96h-384v192h64zM448 352h-320v-96l-128 128 128 128v-96h384v-192h-64z"
    v-bind:fill="color"
  )
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
