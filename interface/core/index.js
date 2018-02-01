import createNode_ from './create-node'
import attributes_ from './attributes'
import coords_ from './coords'
import class_ from './class'
import style_ from './style'
import text_ from './text'
import append_ from './append'
import events_ from './events'
import assign_ from '../../_/assign'
import animateStyle_ from './animate-style'
import animateCoords_ from './animate-coords'

export default ({
  el,
  svg,
  node,
  attributes,
  coords,
  class: classNames,
  style,
  text,
  append,
  events,
  animateStyle,
  animateCoords,
  ...assign
}) => {
  if (!node) node = createNode_({ el, svg })

  if (attributes) attributes_(node, attributes)
  if (coords) coords_(node, coords)
  if (classNames) class_(node, classNames)
  if (style) style_(node, style)
  if (text) text_(node, text)
  if (append) append_(node, append)
  if (events) events_(node, events)
  if (animateStyle) animateStyle_.call(null, node, ...animateStyle)
  if (animateCoords) animateCoords_.call(null, node, ...animateCoords)
  if (assign) assign_(node, assign)

  return node
}
