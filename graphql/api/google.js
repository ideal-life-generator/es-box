import google from '../utils/google'
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRED } from '../../config'

const createToken = async code => {
  try {
    const { data: { access_token, refresh_token } } = await google({
      method: 'post',
      url: 'oauth2/v4/token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      params: {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRED,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000/google-oauth'
      }
    })

    return { token: access_token, refreshToken: refresh_token }
  } catch (error) {
    throw error.response ? error.response.data.error_description : 'Google token creating is failed'
  }
}

const setToken = token => {
  google.defaults.headers.common.Authorization = `Bearer ${token}`
}

const getAccount = async () => {
  try {
    const { data: { emailAddresses: [{ value: email }] } } = await google('https://people.googleapis.com/v1/people/me', {
      params: {
        personFields: 'emailAddresses',
      }
    })

    return { email }
  } catch (error) {
    throw error
  }
}

export default { createToken, setToken, getAccount }
