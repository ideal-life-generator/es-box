<template lang="pug">
div.counter(v-show="counter.current >= 0 && counter.total" v-text="`${counter.current + 1} / ${counter.total}`")
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
