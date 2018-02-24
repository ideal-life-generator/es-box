import Subscriber from '__/subscriber'
import _cloner from '_/cloner'
import { show, hide } from '../../utils/animations'
import './loader.sass'


export default class Loader {
  static cloneLoader = _cloner({ class: 'loader' })

  state = {
    loading: false,
  }

  $loader = this.cloneLoader()

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
