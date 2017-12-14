<template lang="jade">
resize(:width="300", :height="180")
  div.player player
</template>

<script>
import Resize from '../components/Resize.vue'

export default {
  components: {
    resize: Resize,
  },
}
</script>

<style lang="sass">
@import "../sass/variables.sass"
@import "../sass/mixins.sass"

.player
  border-radius: 0.5px
  color: $white
  +border-neon(0.1px, $white)
</style>
