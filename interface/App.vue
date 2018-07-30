<template lang="pug">
div.app
  div.header
    div.logo
      router-link.home(to="/") Home
    div.navigatoin
      search
      div.account
        div.user(v-if="user" v-text="user.email")
        div.auth(v-else)
          a.login(v-bind:href="`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=http://localhost:3000/google-oauth&scope=https://www.googleapis.com/auth/plus.login+https://www.googleapis.com/auth/user.emails.read+https://www.googleapis.com/auth/youtube.readonly&access_type=offline&response_type=code&prompt=consent`") login
  div.subheader
    player
    counter.counter
  div.left
    div.menu
      playlists-menu
  div.middle
    router-view
  div.right
  youtube-video
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
    Search,
    Player,
    PlusIcon,
    PlaylistsMenu,
    YoutubeVideo,
    Counter
  }
}
</script>

<style lang="sass">
@import 'styles/fonts.sass'
@import 'styles/theme.sass'

.hided
  opacity: 0.5

body
  font-family: 'Open Sans', sans-serif
  color: white

a
  color: white

text
  dominant-baseline: hanging

.app
  overflow: hidden
  flex-grow: 1
  display: grid
  grid-template-areas: 'header header header' 'subheader subheader subheader' 'left middle right'
  grid-template-columns: 210px auto 210px
  grid-template-rows: 50px 50px auto

.header
  grid-area: header
  display: flex

.subheader
  grid-area: subheader
  display: flex
  .counter
    margin-left: auto
    margin-right: 15px

.logo
  width: 90px
  display: flex
  align-items: center
  justify-content: center

.navigatoin
  flex-grow: 1
  display: flex
  align-items: center
  padding-left: 15px
  padding-right: 15px

.account
  margin-left: auto

.left
  grid-area: left
  padding: 10px

.middle
  grid-area: middle

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
