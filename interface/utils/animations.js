import _animateStyle from '_/animate-style'
import _animateCoords from '_/animate-coords'
import _fromTo from '__/from-to'
import _style from '_/style'
import _append from '_/append'
import _remove from '_/remove'

const { round } = Math

export const animationDuration = 1500

export const show = ($element, token) => {
  _animateStyle($element, { opacity: 0 }, { opacity: 1 }, { duration: animationDuration, token })

  _style($element, { display: 'initial' })
}

export const hide = ($element, token) =>
  _animateStyle($element, { opacity: 1 }, { opacity: 0 }, { duration: animationDuration, token }, () =>
    _style($element, { display: 'none' }))

export const showHide = ($from, $to) => {
  hide($from)

  show($to)
}

export const showAppend = ($parent, $element) => {
  _animateStyle($element, { opacity: 0 }, { opacity: 1 }, { duration: animationDuration })

  _append($parent, $element)
}

export const hideRemove = $element =>
  _animateStyle($element, { opacity: 1 }, { opacity: 0 }, { duration: animationDuration }, $animatedElement => _remove($animatedElement))

export const moveTop = ($element, from, to) =>
  _animateCoords($element, { top: from }, { top: to }, { duration: animationDuration })

export const changeOpacity = ($element, from, to, duration) =>
  _fromTo(from, to, duration, ({ r, g, b, a }) =>
    _style($element, { [key]: `rgba(${round(r)}, ${round(g)}, ${round(b)}, ${a.toFixed(5)})` }))

export const changeColor = ($element, key, from, to, duration) =>
  _fromTo(from, to, duration, ({ r, g, b, a }) =>
    _style($element, { [key]: `rgba(${round(r)}, ${round(g)}, ${round(b)}, ${a.toFixed(5)})` }))

export const toggle = (from, to, handler, reverce) => {
  const current = !reverce ? { ...from } : { ...to }
  let forwardToken
  let backToken

  const resolvePrevious = (token = {}) => {
    const { progress, cancel, cursor } = token
    let duration = animationDuration

    if (progress) {
      cancel()

      duration *= cursor
    }

    return duration
  }

  return forward => {
    if (forward) {
      const duration = resolvePrevious(backToken)

      forwardToken = {}

      handler(current, to, forward, { duration, token: forwardToken })
    } else {
      const duration = resolvePrevious(forwardToken)

      backToken = {}

      handler(current, from, forward, { duration, token: backToken })
    }
  }
}

export const toggleSwitchShowHide = ($first, $second, reverce) => {
  _style($second, { display: 'none', opacity: 0 })

  return toggle({ first: 0, second: 1 }, { first: 1, second: 0 }, async (current, to, forward, options) => {
    if (forward) {
      _style($first, { display: 'initial' })
    } else {
      _style($second, { display: 'initial' })
    }

    await _fromTo(current, to, ({ first, second }) => {
      _style($first, { opacity: first })

      _style($second, { opacity: second })
    }, options)

    if (forward) {
      _style($second, { display: 'none' })
    } else {
      _style($first, { display: 'none' })
    }
  }, reverce)
}

export const toggleShowHide = ($element) => {
  _style($element, { display: 'none', opacity: 0 })

  return toggle({ opacity: 0 }, { opacity: 1 }, async (current, to, forward, options) => {
    if (forward) {
      _style($element, { display: 'initial' })
    }

    await _fromTo(current, to, style => _style($element, style), options)

    if (!forward) {
      _style($element, { display: 'none' })
    }
  })
}

export const toggleColor = ($element, key, back, forward) =>
  toggle(back, forward, (from, to, duration) => changeColor($element, key, from, to, duration))
