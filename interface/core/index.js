import __ from '__'
import _animateCoords from '_/animate-coords'
import _animateStyle from '_/animate-style'
import _append from '_/append'
import _attributes from '_/attributes'
import _before from '_/before'
import _classAdd from '_/class-add'
import _classRemove from '_/class-remove'
import _classNames from '_/class'
import _clone from '_/clone'
import _cloner from '_/cloner'
import _collection from '_/collection'
import _coords from '_/coords'
import _createElement from '_/create-element'
import _createNode from '_/create-node'
import _createSvg from '_/create-svg'
import _events from '_/events'
import _eventsRemove from '_/events-remove'
import _fetchGraphql from '_/fetch-graphql'
import _fetch from '_/fetch'
import * as _navigation from '_/navigation'
import _rect from '_/rect'
import _remove from '_/remove'
import _resizer from '_/resizer'
import _separators from '_/separators'
import _style from '_/style'
import _text from '_/text'

const create = ({
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
  if (classNames) _classNames(node, classNames)
  if (style) _style(node, style)
  if (text) _text(node, text)
  if (append) _append(node, append)
  if (events) _events(node, events)
  if (animateStyle) _animateStyle.call(null, node, ...animateStyle)
  if (animateCoords) _animateCoords.call(null, node, ...animateCoords)
  if (assign) __.assign(node, assign)

  if (created) created(node)

  return node
}

export default {
  create,
  animateCoords: _animateCoords,
  animateStyle: _animateStyle,
  append: _append,
  attributes: _attributes,
  before: _before,
  classAdd: _classAdd,
  classRemove: _classRemove,
  classNames: _classNames,
  clone: _clone,
  cloner: _cloner,
  collection: _collection,
  coords: _coords,
  createElement: _createElement,
  createNode: _createNode,
  createSvg: _createSvg,
  events: _events,
  eventsRemove: _eventsRemove,
  fetchGraphql: _fetchGraphql,
  fetch: _fetch,
  navigation: _navigation,
  rect: _rect,
  remove: _remove,
  resizer: _resizer,
  separators: _separators,
  style: _style,
  text: _text
}
