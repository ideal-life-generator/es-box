import _ from '_'
import Subscriber from '__/subscriber'
import { show, hide } from '../../utils/animations'
import './loader.sass'


export default class Loader {
  state = {
    loading: false,
  }

  $loader = _({ class: 'loader' })

  subscriber = new Subscriber({
    LOADING: () => {
      const { state, $loader } = this

      state.loading = true

      show($loader)
    },
    LOADED: () => {
      const { state, $loader } = this

      state.loading = false

      hide($loader)
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
