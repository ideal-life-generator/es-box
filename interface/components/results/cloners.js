import cloner_ from '_/cloner' // eslint-disable-line

export const container = cloner_({})

export const list = cloner_({
  el: 'ul',
  class: 'list',
})

export const item = cloner_({
  el: 'li',
  style: { opacity: 0 },
})

export const thumbnail = cloner_({
  el: 'img',
  class: 'thumbnail',
})

export const title = cloner_({
  el: 'p',
  class: 'title',
})

export const video = cloner_({
  el: 'video',
  class: 'video',
  attributes: {
    controls: true,
    controlslist: 'nodownload',
  },
})

export const source = cloner_({
  el: 'source',
  class: 'source',
  attributes: { type: 'video/mp4' },
})

// <video controlslist="nodownload" src="blob:https://www.youtube.com/97af97d8-c957-4cd7-a4c4-2a1fe581397f" loop=""></video>


export const separators = cloner_({ el: 'ul' })

export const separator = cloner_({
  class: 'separator',
})

export const scroll = cloner_({
  class: 'scroll',
})
