export default type => ({
  action: (...args) => ({
    type,
    args,
  }),
  type,
})
