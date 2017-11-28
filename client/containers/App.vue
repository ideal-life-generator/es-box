<template lang="jade">
div#app
  main.main
    aside.search-container <Search />
    <Results />      
</template>

<script>
import Search from './Search.vue'
import Results from './Results.vue'

export default {
  components: {
    Search,
    Results,
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

.main
  margin-top: 65px
  margin-left: 150px
  margin-right: 150px

.search-container
</style>