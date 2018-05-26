<template lang="jade">
svg.app
  router-view
</template>

<script>
export default {}
</script>

<style lang="sass">
@import 'styles/fonts.sass'
@import 'styles/theme.sass'

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
