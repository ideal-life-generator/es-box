<template lang="jade">
div#app
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
@import "../normalize.sass"

html
  height: 100%

body
  margin: 0px
  min-height: 100%
  display: flex

#app
  flex-grow: 1
  font-family: Open Sans
  background-color: lightblue
  &:hover
    background-color: lightgreen

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