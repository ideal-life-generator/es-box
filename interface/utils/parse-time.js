const { floor } = Math

export default time => {
  const minutes = floor(time / 60)
  const pureSeconds = floor(time % 60)
  const seconds = pureSeconds < 10 ? `0${pureSeconds}` : pureSeconds

  return {
    minutes,
    seconds,
  }
}
