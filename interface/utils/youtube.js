import getVideoId from 'get-video-id'

export const getIdFromUrl = url => getVideoId(url).id
