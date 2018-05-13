import __ from '__'
import { search } from 'api/youtube'

export default new __.Store(
  {
    fetching: false,
    items: [],
    count: 0,
    total: 0,
    error: null
  },
  {
    fetch: async () => {
      this.set({
        fetching: true,
        error: null
      })

      const { data: { items, count, total } } = await search({
        // key: search.state.normalizedValue,
        count: this.state.count
      })

      this.set({
        fetching: false,
        items,
        count,
        total
      })
    }
  }
)
