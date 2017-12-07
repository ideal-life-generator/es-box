<template lang="jade">
div.resize
  div.left-side
  div.player player
</template>

<script>
export default {}
</script>

<style lang="sass">
@import "../sass/variables.sass"
@import "../sass/mixins.sass"

.resize
  position: relative
  display: flex
  .left-side
    $width: 15px
    content: ''
    position: absolute
    top: 0px
    left: - ($width / 2)
    width: $width
    height: 100%
    background-color: blue
    cursor: nesw-resize
  .player
    flex-grow: 1
    border-radius: 0.5px
    color: $white
    +border-neon(0.1px, $white)
</style>