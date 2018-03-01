import _animateStyle from '_/animate-style'
import _animateCoords from '_/animate-coords'
import _fromTo from '__/from-to'
import _style from '_/style'
import _append from '_/append'
import _remove from '_/remove'

const { round } = Math

export const animationDuration = 150

export const show = ($element, token) => {
  _animateStyle($element, { opacity: 0 }, { opacity: 1 }, { duration: animationDuration, token })

  _style($element, { display: 'initial' })
}

export const hide = ($element, token) =>
  _animateStyle($element, { opacity: 1 }, { opacity: 0 }, { duration: animationDuration, token }, () =>
    _style($element, { display: 'none' }))

export const hideShow = ($from, $to) => {
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

export const toggle = (from, to, handler) => {
  const current = { ...from }
  let forward = true
  let forwardToken
  let backToken

  const resolvePrevious = token => {
    const { progress, cancel, cursor } = token
    let duration = animationDuration

    if (progress) {
      cancel()

      duration *= cursor
    }

    return duration
  }

  return () => {
    if (forward) {
      const duration = resolvePrevious(backToken)

      forwardToken = handler(current, to, duration, forward)

      forward = false
    } else {
      const duration = resolvePrevious(forwardToken)

      backToken = handler(current, from, duration, forward)

      forward = true
    }
  }
}

export const toggleSwitchHideShow = ($first, $second) =>
  toggle({ first: 1, second: 0 }, { first: 0, second: 1 }, async (from, to, duration, forward) => {
    if (forward) {
      _style($second, { display: 'initial' })

      const { promise } = _fromTo(from, to, animationDuration, ({ first, second }) => {
        _style($first, { opacity: first })

        _style($second, { opacity: second })
      })

      await promise

      _style($first, { display: 'none' })
    }
  })

export const toggleColor = ($element, key, back, forward) =>
  toggle(back, forward, (from, to, duration) => changeColor($element, key, from, to, duration))
