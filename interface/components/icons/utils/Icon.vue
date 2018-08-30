<template lang="pug">
button.button(
  @click="onClick"
  v-bind:disabled="disabled"
  v-bind:style="additionalStyle"
)
  svg.icon(
    style="{ width: `${size}px`, height: `${size}px` }"
    v-bind:x="x"
    v-bind:y="y"
    v-bind:width="size"
    v-bind:height="size"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
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
    disabled: { type: Boolean },
    additionalStyle: { type: Object },
  },
  methods: {
    onClick() { this.$emit('click') }
  }
}
</script>

<style lang="sass">
.icon

.button
  padding: 0px
  border: none
  outline: none
  background-color: transparent
  cursor: pointer

  &[disabled]
    opacity: 0.5

</style>
