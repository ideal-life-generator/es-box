import _events from '_/events'
import _animateStyle from '_/animate-style'
import _append from '_/append'
import _remove from '_/remove'
import _assign from '__/assign'
import { animationDuration } from './settings'
import state, { on, setValue } from './state'
import { $search, $input, $clear } from './elements'
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
  UPDATE_CLEAR: async () => {
    if (state.clear) {
      _append($search, $clear)

      _animateStyle($clear, { duration: animationDuration }, { opacity: 0 }, { opacity: 1 })
    } else {
      await _animateStyle($clear, { duration: animationDuration }, { opacity: 1 }, { opacity: 0 })

      _remove($clear)
    }
  },
})

export default $search
