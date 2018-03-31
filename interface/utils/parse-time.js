const { floor } = Math

export default (time) => {
  const pureMinutes = floor(time / 60)
  const pureSeconds = floor(time % 60)
  const minutes = pureMinutes.toString()
  const seconds = pureSeconds < 10 ? `0${pureSeconds}` : pureSeconds.toString()

  return {
    minutes,
    seconds
  }
}
