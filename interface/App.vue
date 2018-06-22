<template lang="pug">
div.app
  svg.main-nav
    router-link.link(to="/" tag="text") Search
  svg.top(v-bind:x="size.topX" v-bind:y="size.topY" v-bind:width="size.topWidth" v-bind:height="size.topHeight")
  svg.left(v-bind:x="size.leftX" v-bind:y="size.leftY" v-bind:width="size.leftWidth" v-bind:height="size.leftHeight")
    svg.menu(x="10" y="35")
      playlists-menu
  svg.right(v-bind:x="size.rightX" v-bind:y="size.rightY" v-bind:width="size.rightWidth" v-bind:height="size.rightHeight")
    svg.top-left-bar(x="10" y="10")
      svg.user(v-if="user")
        text.name(v-text="user.email")
      svg.auth(v-else)
        a.login(v-bind:xlink:href="`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=http://localhost:3000/google-oauth&scope=https://www.googleapis.com/auth/plus.login+https://www.googleapis.com/auth/user.emails.read+https://www.googleapis.com/auth/youtube.readonly&access_type=offline&response_type=code&prompt=consent`")
          text login
  div(v-bind:x="size.mainX" v-bind:y="size.mainY" v-bind:width="size.mainWidth" v-bind:height="size.mainHeight")
    router-view
  text.error(v-if="showErrorMessage" v-text="errorMessage")
</template>

<script>
import { mapGetters } from 'vuex'
import gql from 'graphql-tag'
import PlusIcon from 'components/icons/Plus.vue'
import PlaylistsMenu from 'containers/PlaylistsMenu.vue'
import { GOOGLE_CLIENT_ID } from '../config'

export default {
  data: () => ({
    user: {}
  }),
  apollo: {
    user: gql`{
      user {
        _id
        email
      }
    }`
  },
  computed: {
    clientId: () => GOOGLE_CLIENT_ID,
    ...mapGetters([
      'newPlaylist',
      'size',
      'showErrorMessage',
      'errorMessage'
    ])
  },
  components: {
    PlusIcon,
    PlaylistsMenu
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

nav
  .link
    color: white

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

.top-left-bar
  .user
    .name
      font-size: 13px
      fill: white

  .auth
    .login
      cursor: pointer

      text
        font-size: 13px
        fill: white

.menu
  .new
    cursor: pointer
    &:hover
      fill: black

    .title
      font-size: 14px

</style>
