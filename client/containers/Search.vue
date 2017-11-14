<template lang="jade">
div.search
  input.input(:value="value" @input="updateValue" placeholder="Search")
  button.clear(v-show="value" @click="clearValue") <IconClear />
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import IconClear from '../components/Icons/Clear.vue'

export default {
  components: {
    IconClear,
  },
  methods: {
    ...mapActions([
      'updateValue',
      'clearValue',
    ]),
  },
  computed: {
    ...mapGetters({
      value: 'getValue'
    }),
  },
}
</script>

<style lang="sass">
$searchHeight: 39px
$searchBorderWidth: 2px

.search
  display: flex
  height: $searchHeight
  border-style: solid
  border-width: 2px
  border-color: black
  border-radius: $searchHeight / 2
  box-sizing: border-box

.input
  flex-grow: 1
  padding-left: 13px
  padding-right: 3px
  font-size: 18px
  color: black

.clear
  margin-right: 2.5px
  width: $searchHeight - ($searchBorderWidth * 2)
  border-radius: 50%
  fill: black
  cursor: pointer
  &:hover
    fill: maroon
</style>
