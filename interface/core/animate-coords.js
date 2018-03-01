import fromTo_ from '__/from-to'
import coords_ from '_/coords'

export default async (node, from, to, { end, ...options }) => {
  await fromTo_(from, to, options, current => coords_(node, current))

  if (end) {
    end()
  }
}
