<template lang="pug">
icon(v-bind:x="x" v-bind:y="y" v-bind:size="size")
  path(
    d="M384 352h-50.745l-80-80 80-80h50.745v80l112-112-112-112v80h-64c-8.487 0-16.626 3.372-22.627 9.373l-89.373 89.372-89.373-89.373c-6-6-14.14-9.372-22.627-9.372h-96v64h82.745l80 80-80 80h-82.745v64h96c8.487 0 16.626-3.371 22.627-9.373l89.373-89.372 89.373 89.372c6.001 6.002 14.14 9.373 22.627 9.373h64v80l112-112-112-112v80z"
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
