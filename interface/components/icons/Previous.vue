<template lang="pug">
icon(v-bind:x="x" v-bind:y="y" v-bind:size="size")
  path(
    d="M128 448v-384h64v176l160-160v352l-160-160v176z"
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
