import $append from './append'
import $remove from './remove'

export default (ﾟparent, { create, remove }) => {
  const separatorsﾟ = []

  return {
    create: count => {
      const { length } = separatorsﾟ
      const index = length + 1

      if (count > index) {
        const ﾟseparator = create(index)

        separatorsﾟ.push(ﾟseparator)

        $append(ﾟparent, ﾟseparator)
      }
    },
    async remove() {
      const ﾟseparator = separatorsﾟ.pop()

      const romoveReslver = remove(ﾟseparator)

      if (romoveReslver instanceof Promise) {
        await romoveReslver
      }

      $remove(ﾟseparator)
    },
  }
}
