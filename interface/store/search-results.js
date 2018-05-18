import youtube from 'api'
import createAsyncAction from './utils/create-async-action'

export const search = createAsyncAction('SEARCH_RESULTS', async ({ rootState }) =>
  await youtube.search({ key: rootState.search.normalized }))

export default {
  state: {
    ...search.defaultState,
    items: [],
    count: 0,
    total: 0,
  },
  getters: {
    ...search.getters,
    items: state => state.items,
    count: state => state.count,
    total: state => state.total,
  },
  mutations: {
    ...search.mutations
  },
  actions: {
    [search.TYPE]: search.action
  }
}
