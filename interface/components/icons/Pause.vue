<template lang="pug">
icon(v-bind:x="x" v-bind:y="y" v-bind:size="size")
  path(
    d="M64 64h160v384h-160zM288 64h160v384h-160z"
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
