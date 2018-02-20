import fromTo_ from '__/from-to'
import style_ from '_/style'

export default async (node, from, to, options, end) => {
  await fromTo_(from, to, options, current => style_(node, current))

  if (typeof end === 'function') {
    end(node)
  }
}
