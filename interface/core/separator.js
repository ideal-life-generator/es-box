import append_ from './append'
import remove_ from './remove'

export default (parent, { create, remove }) => {
  const separatorsﾟ = []

  return {
    create: count => {
      const { length } = separatorsﾟ
      const index = length + 1

      if (count > index) {
        const separator = create(index)

        separatorsﾟ.push(separator)

        append_(parent, separator)
      }
    },
    async remove() {
      if (separatorsﾟ.length > 0) {
        const separator = separatorsﾟ.pop()

        const romoveReslver = remove(separator)

        if (romoveReslver instanceof Promise) {
          await romoveReslver
        }

        remove_(separator)
      }
    },
  }
}
