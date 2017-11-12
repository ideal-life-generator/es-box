import createReducer, { createAction } from 'ideal-redux-utils'

export const { type: SEARCH_SET, action: set } = createAction('SEARCH_SET', 'value')
export const { type: SEARCH_CLEAR, action: clear } = createAction('SEARCH_CLEAR')

export default createReducer({
  value: '',
}, {
  [SEARCH_SET]: (state, { value }) => ({ ...state, value }),
  [SEARCH_CLEAR]: state => ({ ...state, value: '' }),
})
