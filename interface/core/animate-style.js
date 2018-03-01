import fromTo_ from '__/from-to'
import style_ from '_/style'

export default async (node, from, to, { end, ...options }) => {
  await fromTo_(from, to, options, current => style_(node, current))

  if (end) {
    end()
  }
}
