import { spawn } from 'child_process'
import { resolve as resolvePath } from 'path'

export default id => new Promise((resolve, reject) => {
  const youtubeDl = spawn(resolvePath('youtube-dl.exe'), [
    '--dump-json',
    // '--format mp3',
    id,
  ])

  youtubeDl.stdout.on('data', d => {
    resolve(JSON.parse(d, 2, 2))
  })
})

// import { getInfo } from 'ytdl-core'

// export default async id => await getInfo(id, {
//   filter: { formats: format => console.log('###') || format.container === 'mp3' },
// })
