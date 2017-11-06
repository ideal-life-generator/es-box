import createAction from './utils/create-action'
import createReducer from './utils/create-reducer'

export const { type: EXAMPLE_SET_NAME, action: setName } = createAction('EXAMPLE_SET_NAME')

export default createReducer({
  name: '',
}, {
  [EXAMPLE_SET_NAME]: (state, name) => ({ ...state, name }),
})
