import request from './utils/request'
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRED } from '../../config'

const token = async code => {
  try {
    const { data } = await request.post('https://www.googleapis.com/oauth2/v4/token', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRED,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000/google-oauth'
      }
    })

    console.log(data)

    return {
      email: 'test@mail'
    }
  } catch (error) {
    console.log(error.response)
  }
}

export default { token }
