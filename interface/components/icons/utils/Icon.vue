<template lang="pug">
svg.icon(
  v-bind:x="x"
  v-bind:y="y"
  v-bind:width="size"
  v-bind:height="size"
  viewBox="0 0 512 512"
  xmlns="http://www.w3.org/2000/svg"
  @click="onClick"
)
  circle(cx="12" cy="12" r="12" stroke="0" fill="transparent")
  slot(v-bind:size="size")
</template>

<script>
export default {
  props: {
    x: { type: Number },
    y: { type: Number },
    size: { type: Number, required: true },
  },
  methods: {
    onClick() { this.$emit('click') }
  }
}
</script>

<style lang="sass">
.icon
  cursor: pointer
</style>
