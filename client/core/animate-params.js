import $fromTo from './from-to'
import $params from './params'

export default (node, params, from, to) =>
  $fromTo(from, to, params, current => $params(node, current))
