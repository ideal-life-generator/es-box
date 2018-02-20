import _separators from '_/separators'
import { itemHeight } from '../settings'
import { separator as cloneSeparator } from '../cloners'
import { $separators } from './elements'
import { show, hide } from '../../../utils/animations'

export default _separators($separators, {
  create: i => cloneSeparator({
    coords: { top: i * itemHeight },
    created: $element => show($element),
  }),
  remove: $separator => hide($separator),
})
