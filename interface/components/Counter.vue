<template lang="pug">
div.counter(v-show="counter.current >= 0 && counter.count" v-text="`${counter.current + 1} / ${counter.count}`")
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'counter'
    ]),
  }
}
</script>

<style lang="sass">
.counter
</style>
