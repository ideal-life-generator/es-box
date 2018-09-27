export default length => {
  const results = []
  const possibleValues = Array.from({ length }, (value, i) => i)

  for (let i = 0; i < length; i += 1) {
    const possibleValuesRange = length - (length - possibleValues.length)
    const randomNumber = Math.floor(Math.random() * possibleValuesRange)
    const normalizedRandomNumber = randomNumber !== possibleValuesRange ? randomNumber : possibleValuesRange

    const [nextNumber] = possibleValues.splice(normalizedRandomNumber, 1)

    results.push(nextNumber)
  }

  return results
}
