<template lang="jade">
div#app
  main.container
    aside.search-container <Search />
    section.main
      <Results />
      <Player />
</template>

<script>
import Search from './Search.vue'
import Results from './Results.vue'
import Player from './Player.vue'

export default {
  components: {
    Search,
    Results,
    Player,
  },
}
</script>

<style lang="sass">
@import "../../normalize.sass"
@import "../sass/mixins.sass"
@import "../sass/variables.sass"

html
  height: 100%

body
  margin: 0px
  min-height: 100%
  display: flex

#app
  flex-grow: 1
  font-family: Open Sans
  // background-image: url("../static/maxresdefault.jpg")
  // background-position: center
  // background-repeat: no-repeat
  // background-size: cover

.container
  margin-top: 65px
  margin-left: 150px
  margin-right: 150px

.search-container

.main
  padding: 30px
  display: flex
</style>