import $createNode from './create-node'
import $clone from './clone'
import $attributes from './attributes'
import $params from './params'
import $classes from './classes'
import $style from './style'
import $text from './text'
import $append from './append'
import $events from './events'
import $assign from './assign'
import $animateStyle from './animate-style'
import $animateParams from './animate-params'

export default ({
  element,
  svg,
  node,
  attributes,
  params,
  classes,
  style,
  text,
  append,
  events,
  animateStyle,
  animateParams,
  ...assign
}) => {
  if (node) node = $clone(node)
  else node = $createNode({ element, svg })

  if (attributes) $attributes(node, attributes)
  if (params) $params(node, params)
  if (classes) $classes(node, classes)
  if (style) $style(node, style)
  if (text) $text(node, text)
  if (append) $append(node, append)
  if (events) $events(node, events)
  if (animateStyle) $animateStyle.call(null, node, ...animateStyle)
  if (animateParams) $animateParams.call(null, node, ...animateParams)
  if (assign) $assign(node, assign)

  return node
}
