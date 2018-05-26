<template lang="jade">
text.white Login is processed...
</template>

<script>
export default {
  mounted() {
    console.log(this.$route.query.code)
  }
}
</script>

<style lang="sass">
text.white
  fill: white

</style>
