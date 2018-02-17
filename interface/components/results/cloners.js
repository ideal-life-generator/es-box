import _cloner from '_/cloner' // eslint-disable-line

export const cloneContainer = _cloner()

export const cloneList = _cloner({
  el: 'ul',
  class: 'list',
})

export const cloneItem = _cloner({
  el: 'li',
  style: { opacity: 0 },
})

export const cloneThumbnail = _cloner({
  el: 'img',
  class: 'thumbnail',
})

export const cloneTitle = _cloner({
  el: 'p',
  class: 'title',
})

export const cloneSeparators = _cloner({ el: 'ul' })

export const cloneSeparator = _cloner({
  class: 'separator',
})

export const cloneScroll = _cloner({
  class: 'scroll',
})
