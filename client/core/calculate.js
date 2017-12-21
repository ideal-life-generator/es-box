export default items => {
  const results = []

  items.forEach((item, i) => {
    if (typeof item !== 'function') return results[i] = item

    results[i] = item.call(null, ...results)
  })

  return results
}
