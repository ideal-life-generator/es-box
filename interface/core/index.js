import _createNode from '_/create-node'
import _attributes from '_/attributes'
import _coords from '_/coords'
import _class from '_/class'
import _style from '_/style'
import _text from '_/text'
import _append from '_/append'
import _events from '_/events'
import _assign from '__/assign'
import _animateStyle from '_/animate-style'
import _animateCoords from '_/animate-coords'

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
  created,
  ...assign
}) => {
  if (!node) node = _createNode({ el, svg })

  if (attributes) _attributes(node, attributes)
  if (coords) _coords(node, coords)
  if (classNames) _class(node, classNames)
  if (style) _style(node, style)
  if (text) _text(node, text)
  if (append) _append(node, append)
  if (events) _events(node, events)
  if (animateStyle) _animateStyle.call(null, node, ...animateStyle)
  if (animateCoords) _animateCoords.call(null, node, ...animateCoords)
  if (assign) _assign(node, assign)

  if (created) created(node)

  return node
}

export { default as animateCoords } from '_/animate-coords'
export { default as animateStyle } from '_/animate-style'
export { default as append } from '_/append'
export { default as attributes } from '_/attributes'
export { default as before } from '_/before'
export { default as classAdd } from '_/class-add'
export { default as classRemove } from '_/class-remove'
export { default as classNames } from '_/class'
export { default as clone } from '_/clone'
export { default as cloner } from '_/cloner'
export { default as collection } from '_/collection'
export { default as coords } from '_/coords'
export { default as createElement } from '_/create-element'
export { default as createNode } from '_/create-node'
export { default as createSvg } from '_/create-svg'
export { default as events } from '_/events'
export { default as eventsRemove } from '_/events-remove'
export { default as fetchGraphql } from '_/fetch-graphql'
export { default as fetch } from '_/fetch'
export * as navigation from '_/navigation'
export { default as rect } from '_/rect'
export { default as remove } from '_/remove'
export { default as resizer } from '_/resizer'
export { default as separators } from '_/separators'
export { default as style } from '_/style'
export { default as text } from '_/text'
