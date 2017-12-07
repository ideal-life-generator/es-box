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
      value: 'value',
    }),
  },
}
</script>

<style lang="sass">
@import "../sass/mixins.sass"
@import "../sass/variables.sass"

$searchHeight: 39px
$searchBorderWidth: 2px

.search
  display: flex
  height: $searchHeight
  border-style: solid
  border-width: 1px
  border-color: $white
  border-radius: $searchHeight / 2
  box-sizing: border-box
  +border-neon(0.5px, $violet)

::-webkit-input-placeholder
  color: fade-out($white, 0.45)

.input
  flex-grow: 1
  padding-left: 13px
  padding-right: 3px
  font-size: 18px
  color: black
  font-size: 16.5px
  color: $white
  +text-neon(0.15px, fade-out($white, 0.8))

.clear
  margin-right: 2.5px
  width: $searchHeight - ($searchBorderWidth * 2)
  border-radius: 50%
  fill: $white
  +svg-neon(1.5px, $white)
  cursor: pointer
  transition: all 0.3s easy-in-out
  &:hover
    fill: fade-out($white, 0.3)
    +svg-neon(0.15px, $white)
</style>
