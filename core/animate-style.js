import $fromTo from './from-to'
import $style from './style'

export default (node, params, from, to) =>
  $fromTo(from, to, params, current => $style(node, current))
