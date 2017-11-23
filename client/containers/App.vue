<template lang="jade">
div#app
  table
    tr
      td hi
  main.main
    aside.search-container <Search />
    section.content
      ul.lists
        li Song prototype
</template>

<script>
import Search from './Search.vue'

export default {
  components: {
    Search,
  },
}
</script>

<style lang="sass">
@import "../../normalize.sass"

html
  height: 100%

body
  margin: 0px
  min-height: 100%
  display: flex

#app
  flex-grow: 1
  font-family: Open Sans
  background-image: url("../static/maxresdefault.jpg")
  background-position: center
  background-repeat: no-repeat
  background-size: cover

.main
  margin-top: 65px
  margin-left: 150px
  margin-right: 150px

.search-container

.content

.lists
  width: 375px
  margin: 15px
  padding: 15px
  border-radius: 0.5px
  background-color: lavenderblush
</style>