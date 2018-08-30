<template lang="pug">
div.main
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
    router-view.view
  //- div.right
  div.flexible(
    v-bind:style="{ top: `${youtubePlayer.y}px`, left: `${youtubePlayer.x}px`, width: `${youtubePlayer.width}px`, height: `${youtubePlayer.height}px` }"
  )
    div.area
      enlarge-icon.move(
        v-bind:size="25"
        v-bind:style="{ cursor: 'move' }"
        v-on:mousedown.native="onStartMove"
      )
      maximize-icon.resize(
        v-bind:size="25"
        v-bind:style="{ cursor: 'nwse-resize' }"
        v-on:mousedown.native="onStartResize"
      )
    div.target
      youtube-video(
        v-bind:width="youtubePlayer.width"
        v-bind:height="youtubePlayer.height"
      )
</template>

<script>
import { mapGetters } from 'vuex'
import gql from 'graphql-tag'
import Search from 'containers/Search.vue'
import Player from 'containers/Player.vue'
import PlusIcon from 'components/icons/Plus.vue'
import EnlargeIcon from 'components/icons/Enlarge.vue'
import MaximizeIcon from 'components/icons/Maximize.vue'
import PlaylistsMenu from 'containers/PlaylistsMenu.vue'
import YoutubeVideo from 'containers/YoutubeVideo.vue'
import Counter from 'components/Counter.vue'
import {
  YOUTUBE_PLAYER_SET_COORDINATES,
  YOUTUBE_PLAYER_SET_SIZE
} from 'store/youtube-player'
import { GOOGLE_CLIENT_ID } from '../../config'

export default {
  data: () => ({
    user: {},
    lastMoveX: null,
    lastMoveY: null
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
      'youtubePlayer'
    ])
  },
  methods: {
    onStartMove(event) {
      this.lastMoveX = event.clientX
      this.lastMoveY = event.clientY

      document.addEventListener('mousemove', this.onMove)
      document.addEventListener('mouseup', this.onEndMove)
    },
    onMove(event) {
      this.$store.commit(YOUTUBE_PLAYER_SET_COORDINATES, {
        x: this.youtubePlayer.x + (event.clientX - this.lastMoveX),
        y: this.youtubePlayer.y + (event.clientY - this.lastMoveY)
      })

      this.lastMoveX = event.clientX
      this.lastMoveY = event.clientY
    },
    onEndMove(event) {
      document.removeEventListener('mousemove', this.onMove)
      document.removeEventListener('mouseup', this.onEndMove)
    },
    onStartResize(event) {
      this.lastResizeX = event.clientX
      this.lastResizeY = event.clientY

      document.addEventListener('mousemove', this.onResize)
      document.addEventListener('mouseup', this.onEndResize)
    },
    onResize(event) {
      // this.$store.commit(YOUTUBE_PLAYER_SET_COORDINATES, {
      //   x: this.youtubePlayer.x + (event.clientX - this.lastResizeX),
      //   y: this.youtubePlayer.y + (event.clientY - this.lastResizeY)
      // })

      const moveX = event.clientX - this.lastResizeX
      const moveY = event.clientY - this.lastResizeY
      let width, height
      if (moveX > moveY) {
        width = this.youtubePlayer.width + moveX
        height = width * 0.5625
      } else {
        height = this.youtubePlayer.height + moveY
        width = height / 0.5625
      }

      this.$store.commit(YOUTUBE_PLAYER_SET_SIZE, { width, height })

      this.lastResizeX = event.clientX
      this.lastResizeY = event.clientY
    },
    onEndResize(event) {
      document.removeEventListener('mousemove', this.onResize)
      document.removeEventListener('mouseup', this.onEndResize)
    }
  },
  components: {
    Search,
    Player,
    PlusIcon,
    EnlargeIcon,
    MaximizeIcon,
    PlaylistsMenu,
    YoutubeVideo,
    Counter
  }
}
</script>

<style lang="sass">
@import '../styles/fonts.sass'
@import '../styles/theme.sass'

.hided
  opacity: 0.5

body
  font-family: 'Open Sans', sans-serif
  color: white

a
  color: white

text
  dominant-baseline: hanging

.main
  overflow: hidden
  flex-grow: 1
  display: grid
  grid-template-areas: 'header header header' 'subheader subheader subheader' 'left middle middle'
  grid-template-columns: 300px auto 500px
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
  margin-left: 10px
  display: flex

  .view
    flex-grow: 1

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

.flexible
  $move-size: 40px
  position: fixed

  &:hover
    .panel
      display: initial

  .area
    position: absolute
    top: -($move-size)
    left: -($move-size)
    width: calc(100% + #{$move-size * 2})
    height: calc(100% + #{$move-size * 2})

    &:hover
      .move, .resize
        display: initial

    .move
      position: absolute
      left: 5px
      top: 5px
      display: none

    .resize
      position: absolute
      right: 5px
      bottom: 5px
      display: none

    .panel

  .target
    position: absolute

</style>
