<template lang="jade">
svg.list
  item(
    v-for="(item, i) in items"
    v-bind:key="item.id"
    v-bind:height="itemHeight"
    v-bind:y="itemHeight * i"
    v-bind:playerY="size.resultsY + (itemHeight * i)"
    v-bind="item"
  )
  text.loading(v-show="loading" x="50" y="50") loading
</template>

<script>
import { mapGetters } from 'vuex'
import { search } from 'store/search-results'
import Item from './Item.vue'

export default {
  data: () => ({
    itemHeight: 145.5
  }),
  mounted() { this.$store.dispatch(search.TYPE) },
  computed: {
    ...search.gettersMap,
    ...mapGetters([
      'items',
      'count',
      'total',
      'size'
    ])
  },
  components: {
    Item
  }
}
</script>

<style lang="sass">
.list
  margin-top: 10px
  margin-bottom: 10px
  flex-grow: 1
  display: flex

</style>
