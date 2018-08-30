<template lang="pug">
div.app
  router-view
  div.error(v-if="showErrorMessage" v-text="errorMessage")
</template>

<script>
import { mapGetters } from 'vuex'
import gql from 'graphql-tag'
import Search from 'containers/Search.vue'
import Player from 'containers/Player.vue'
import PlusIcon from 'components/icons/Plus.vue'
import PlaylistsMenu from 'containers/PlaylistsMenu.vue'
import YoutubeVideo from 'containers/YoutubeVideo.vue'
import Counter from 'components/Counter.vue'
import { GOOGLE_CLIENT_ID } from '../config'

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
