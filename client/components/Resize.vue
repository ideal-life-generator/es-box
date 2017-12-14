<template lang="jade">
div.resize(:style="{ width: resizedWidth + 'px', height: resizedHeight + 'px' }")
  div.resize-icon(@mousedown="start")
  slot
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
  },
  data() {
    return {
      startWidth: null,
      startHeight: null,
      startX: null,
      startY: null,
      resizedWidth: this.width,
      resizedHeight: this.height,
    }
  },
  methods: {
    start({ pageX, pageY }) {
      this.startWidth = this.resizedWidth
      this.startHeight = this.resizedHeight
      this.startX = pageX
      this.startY = pageY

      window.addEventListener('mousemove', this.move)
      window.addEventListener('mouseup', this.end)
    },
    move({ pageX, pageY }) {
      const xDifference = -(pageX - this.startX)
      const yDifference = pageY - this.startY

      const resizedWidth = this.startWidth + xDifference
      const resizedHeight = this.startHeight + yDifference

      if (resizedWidth < this.width) {
        this.resizedWidth = this.width
      } else {
        this.resizedWidth = resizedWidth
      }

      if (resizedHeight < this.height) {
        this.resizedHeight = this.height
      } else {
        this.resizedHeight = resizedHeight
      }
    },
    end() {
      this.startWidth = null
      this.startHeight = null
      this.startX = null
      this.startY = null

      window.removeEventListener('mousemove', this.move)
      window.removeEventListener('mouseup', this.end)
    },
  },
}
</script>

<style lang="sass">
@import "../sass/variables.sass"
@import "../sass/mixins.sass"

.resize
  position: relative
  display: flex
  .resize-icon
    $size: 15px
    position: absolute
    left: 0px
    bottom: 0px
    width: $size
    height: $size
    background-color: fade_out($white, 0.75)
    cursor: nesw-resize
  .player
    flex-grow: 1
    border-radius: 0.5px
    color: $white
    +border-neon(0.1px, $white)
</style>
