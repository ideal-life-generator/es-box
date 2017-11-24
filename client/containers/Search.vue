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
      value: 'getValue',
    }),
  },
}
</script>

<style lang="sass">
@import '../sass/mixins.sass'
@import '../sass/theme.sass'

$searchHeight: 39px
$searchBorderWidth: 2px

.search
  display: flex
  height: $searchHeight
  border-style: solid
  border-width: 1px
  border-color: #fff
  border-radius: $searchHeight / 2
  box-sizing: border-box
  +border-neon(1px, $violet)

::-webkit-input-placeholder
  color: fade-out(#fff, 0.45)

.input
  flex-grow: 1
  padding-left: 13px
  padding-right: 3px
  font-size: 18px
  color: black
  font-size: 16.5px
  color: #fff
  +text-neon(0.5px, fade-out(#fff, 0.8))

.clear
  margin-right: 2.5px
  width: $searchHeight - ($searchBorderWidth * 2)
  border-radius: 50%
  fill: #fff
  +svg-neon(1.5px, #fff)
  cursor: pointer
  transition: all 0.3s easy-in-out
  &:hover
    fill: fade-out(#fff, 0.3)
    +svg-neon(0.5px, #fff)
</style>
