import fromTo_ from '__/from-to' // eslint-disable-line
import style_ from '_/style' // eslint-disable-line

export default async (node, params, from, to, end) => {
  await fromTo_(from, to, params, current => style_(node, current))

  if (typeof end === 'function') {
    end(node)
  }
}
