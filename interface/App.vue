<template lang="jade">
div.app
  router-view
  div.error(v-if="showErrorMessage" v-text="errorMessage")
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'showErrorMessage',
      'errorMessage'
    ])
  }
}
</script>

<style lang="sass">
@import 'styles/fonts.sass'
@import 'styles/theme.sass'

body
  font-family: 'Open Sans', sans-serif

text
  dominant-baseline: hanging

.app
  flex-grow: 1
  display: flex

.error
  position: fixed
  bottom: 0px
  width: 100%
  height: 25px
  display: flex
  align-items: center
  padding-left: 220px
  background-color: #ed3434
  font-size: 13px
  color: white

</style>
