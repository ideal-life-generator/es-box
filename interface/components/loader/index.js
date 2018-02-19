import _ from '_' // eslint-disable-line
import _coords from '_/coords' // eslint-disable-line
import _append from '_/append' // eslint-disable-line
import _remove from '_/remove' // eslint-disable-line
import _animateStyle from '_/animate-style' // eslint-disable-line
import * as clone from './cloners'
import createState from './state'
import { animationDuration } from './settings'
import './index.sass'

export default ($parent, options = {}) => {
  const {
    state,
    emit,
    on,
    setPosition,
    setSize,
    setLoading,
  } = createState()

  let $loader = clone.loader()

  on({
    POSITION_CHANGED: () => {
      const { left, top } = state

      _coords($loader, { left, top })
    },
    SIZE_CHANGED: () => {
      const { size: width, size: height } = state

      _coords($loader, { width, height })
    },
    LOADING: () => {
      $loader = clone.loader()

      _animateStyle($loader, { duration: animationDuration }, { opacity: 0 }, { opacity: 1 })
      _append($parent, $loader)
    },
    LOADED: () => {
      _animateStyle($loader, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 }, $element => _remove($element))
    },
  })

  if (options.position) {
    setPosition(options.position)
  }

  if (options.size) {
    setSize(options.size)
  }

  if (options.loading) {
    setLoading(options.loading)
  }

  return {
    state,
    emit,
    on,
    setPosition,
    setSize,
    setLoading,
  }
}
