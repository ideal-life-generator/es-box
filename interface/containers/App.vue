<template lang="jade">
svg.content
  svg.top(v-bind:x="size.topX" v-bind:y="size.topY" v-bind:width="size.topWidth" v-bind:height="size.topHeight")
  svg(v-bind:x="size.leftX" v-bind:y="size.leftY" v-bind:width="size.leftWidth" v-bind:height="size.leftHeight")
    svg.top-left-bar(x="10" y="10")
      svg.user(v-if="user")
        text.name User Name
      svg.auth(v-else)
        a.login(xlink:href="https://accounts.google.com/o/oauth2/v2/auth?client_id=388620875423-cdin82r5e0c19p7or0ei8nol7c5024em.apps.googleusercontent.com&redirect_uri=http:%2F%2Flocalhost:3000%2Fgoogle-oauth&scope=https:%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.readonly&response_type=code")
          text login
    svg.menu(x="15" y="50")
      text(fill="white") Playlists
      svg
        svg.new-playlist(v-if="newPlaylist")
          text.title(v-text="newPlaylist.normalizedName" x="10" y="22" fill="white")
          svg(v-for="(item, i) in newPlaylist.items")
            text(x="15" v-bind:y="40 + (i * 15)" v-text="item.title")
  svg(v-bind:x="size.mainX" v-bind:y="size.mainY" v-bind:width="size.mainWidth" v-bind:height="size.mainHeight")
    search
    search-results(v-bind:x="size.resultsX" v-bind:y="size.resultsY")
  svg(v-bind:x="size.rightX" v-bind:y="size.rightY" v-bind:width="size.rightWidth" v-bind:height="size.rightHeight")
    plus-icon(
      v-bind:x="20"
      v-bind:y="25"
      v-bind:size="31"
      color="black"
      @click.native="addPlaylist()"
    )
  router-view
</template>

<script>
import { mapGetters } from 'vuex'
import Search from './Search.vue'
import SearchResults from './SearchResults/index.vue'
import PlusIcon from 'components/icons/Plus.vue'

export default {
  computed: {
    ...mapGetters([
      'user',
      'newPlaylist',
      'size'
    ])
  },
  methods: {
    addPlaylist() { this.$store.commit('createPlaylist') }
  },
  components: {
    Search,
    SearchResults,
    PlusIcon
  }
}
</script>

<style lang="sass">
@import '../styles/fonts.sass'
@import '../styles/theme.sass'

body
  font-family: 'Open Sans', sans-serif

text
  dominant-baseline: hanging

.content
  flex-grow: 1

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
    .new-playlist
      cursor: pointer

      .title
        font-size: 14px

</style>
