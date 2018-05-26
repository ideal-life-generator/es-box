import axios from './utils/axios'

const auth = async () => {
  const { data } = await axios('https://accounts.google.com/o/oauth2/v2/auth', {
    params: {
      client_id: '388620875423-cdin82r5e0c19p7or0ei8nol7c5024em.apps.googleusercontent.com',
      redirect_uri: 'http://localhost:3000/google-oauth',
      scope: 'https://www.googleapis.com/auth/youtube.readonly',
    }
  })

  return data
}

export default { auth }
