import _ from '_'
import Subscriber from '__/subscriber'
import { toggleShowHide } from '../utils/animations'
import './loader.sass'

export default class Loader {
  state = {
    loading: false,
  }

  $loader = _({ class: 'loader' })
  toggleShowHideLoader = toggleShowHide(this.$loader)

  subscriber = new Subscriber({
    LOADING: () => {
      const { state, toggleShowHideLoader } = this

      state.loading = true

      toggleShowHideLoader(true)
    },
    LOADED: () => {
      const { state, toggleShowHideLoader } = this

      state.loading = false

      toggleShowHideLoader(false)
    },
  })

  setLoading = loading => {
    const { subscriber: { emit } } = this

    if (loading) {
      emit('LOADING')
    } else {
      emit('LOADED')
    }
  }

  constructor(options = {}) {
    const { loading } = options
    const { setLoading } = this

    if (loading) {
      setLoading(loading)
    }
  }
}
