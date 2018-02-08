import append_ from '_/append' // eslint-disable-line
import remove_ from '_/remove' // eslint-disable-line

export default (parent, { create, remove }) => {
  const separators = []

  return {
    create: count => {
      const { length: separatorsCount } = separators

      const nextCount = count - 1

      if (separatorsCount < nextCount) {
        for (let index = separatorsCount; index < nextCount; index += 1) {
          const separator = create(index + 1)

          separators.push(separator)

          append_(parent, separator)
        }
      }
    },
    remove: async count => {
      const { length: separatorsCount } = separators

      const nextCount = count - 1

      if (separatorsCount > nextCount) {
        const removeResolvers = []

        for (let index = separatorsCount; nextCount < index; index -= 1) {
          const separator = separators.pop()
          const romoveReslver = remove(separator)

          if (romoveReslver instanceof Promise) {
            removeResolvers.push((async () => {
              await romoveReslver

              remove_(separator)
            })())
          }
        }

        Promise.all(removeResolvers)
      }
    },
  }
}
