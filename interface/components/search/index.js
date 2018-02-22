import _events from '_/events'
import _assign from '__/assign'
import state, { on, setValue } from './state'
import { $search, $input, $clear } from './elements'
import { showAppend, hideRemove } from '../../utils/animations'
import './index.sass'

_events($input, {
  input: ({ target: { value } }) => setValue(value),
})

_events($clear, {
  click: () => {
    _assign($input, { value: '' })

    setValue('', true)
  },
})

on({
  UPDATE_CLEAR: () => {
    if (state.clear) {
      showAppend($search, $clear)
    } else {
      hideRemove($clear)
    }
  },
})

export default $search
