<template lang="pug">
icon(v-bind:x="x" v-bind:y="y" v-bind:size="size")
  path(
    d="M96 64l320 192-320 192z"
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
