import _animateStyle from '_/animate-style'
import _fromTo from '__/from-to'
import _style from '_/style'

const { round } = Math

export const animationDuration = 150

export const moveTop = ($element, from, to) =>
  _animateStyle($element, { top: `${from}px` }, { top: `${to}px` })

export const toggle = (from, to, handler) => {
  let forwardToken
  let backToken

  const resolvePrevious = (token = {}) => {
    const { progress, cancel, cursor, current } = token
    let duration = animationDuration

    if (progress) {
      cancel()

      duration *= cursor
    }

    return {
      current,
      duration
    }
  }

  return (forward) => {
    if (forward) {
      const { current, duration } = resolvePrevious(backToken)

      forwardToken = {}

      handler(current || from, to, forward, { duration, token: forwardToken })
    } else {
      const { current, duration } = resolvePrevious(forwardToken)

      backToken = {}

      handler(current || to, from, forward, { duration, token: backToken })
    }
  }
}

export const toggleSwitchShowHide = ($first, $second) => {
  _style($first, { display: 'initial', opacity: 1 })
  _style($second, { display: 'none', opacity: 0 })

  return toggle(
    { first: 0, second: 1 },
    { first: 1, second: 0 },
    async (current, next, forward, options) => {
      if (forward) {
        _style($first, { display: 'initial' })
      } else {
        _style($second, { display: 'initial' })
      }

      await _fromTo(
        current,
        next,
        ({ first, second }) => {
          _style($first, { opacity: first })

          _style($second, { opacity: second })
        },
        options
      )

      if (forward) {
        _style($second, { display: 'none' })
      } else {
        _style($first, { display: 'none' })
      }
    }
  )
}

export const toggleShowHide = ($element) => {
  _style($element, { display: 'none', opacity: 0 })

  return toggle(
    { opacity: 0 },
    { opacity: 1 },
    async (current, next, forward, options) => {
      if (forward) {
        _style($element, { display: 'initial' })
      }

      await _fromTo(current, next, (style) => _style($element, style), options)

      if (!forward) {
        _style($element, { display: 'none' })
      }
    }
  )
}

export const toggleColor = ($element, from, to, key) =>
  toggle(from, to, (current, next, forward, options) =>
    _fromTo(
      current,
      next,
      ({ r, g, b, a }) =>
        _style($element, {
          [key]: `rgba(${round(r)}, ${round(g)}, ${round(b)}, ${a.toFixed(5)})`
        }),
      options
    )
  )

export const toggleWhiteViolet = ($element, key) =>
  toggleColor(
    $element,
    { r: 255, g: 255, b: 255, a: 0.8 },
    { r: 255, g: 0, b: 222, a: 0.8 },
    key
  )
