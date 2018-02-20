import _animateStyle from '_/animate-style'
import _animateCoords from '_/animate-coords'
import _fromTo from '__/from-to'
import _style from '_/style'
import _append from '_/append'
import _remove from '_/remove'

const { round } = Math

export const animationDuration = 150

export const show = $element => {
  _animateStyle($element, { opacity: 0 }, { opacity: 1 }, { duration: animationDuration })

  _style($element, { display: 'initial' })
}

export const hide = $element =>
  _animateStyle($element, { opacity: 1 }, { opacity: 0 }, { duration: animationDuration }, () =>
    _style($element, { display: 'none' }))

export const showAppend = ($parent, $element) => {
  _animateStyle($element, { opacity: 0 }, { opacity: 1 }, { duration: animationDuration })

  _append($parent, $element)
}

export const hideRemove = $element =>
  _animateStyle($element, { opacity: 1 }, { opacity: 0 }, { duration: animationDuration }, $animatedElement => _remove($animatedElement))

export const moveTop = ($element, from, to) =>
  _animateCoords($element, { top: from }, { top: to }, { duration: animationDuration })

export const changeColor = ($element, key, from, to) =>
  _fromTo(from, to, { duration: animationDuration }, ({ r, g, b, a }) =>
    _style($element, { [key]: `rgba(${round(r)}, ${round(g)}, ${round(b)}, ${a.toFixed(5)})` }))
