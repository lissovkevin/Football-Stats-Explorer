import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'

const API_URL = 'https://football-api-quza.onrender.com/graphql'

function Login() {
  const navigate = useNavigate()

  async function handleSuccess(response) {
    localStorage.setItem('google_token', response.credential)

    const payload = JSON.parse(atob(response.credential.split('.')[1]))
    const email = payload.email
    const googleId = payload.sub

    const registerResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
        mutation {
          register(username: "${email}", password: "${googleId}") {
            token
          }
        }
      `,
      }),
    })

    const registerData = await registerResponse.json()

    if (registerData.data && registerData.data.register) {
      localStorage.setItem('jwt_token', registerData.data.register.token)
      navigate('/dashboard')
      return
    }

    const loginResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
        mutation {
          login(username: "${email}", password: "${googleId}") {
            token
          }
        }
      `,
      }),
    })

    const loginData = await loginResponse.json()

    if (loginData.data && loginData.data.login) {
      localStorage.setItem('jwt_token', loginData.data.login.token)
    }

    navigate('/dashboard')
  }

  function handleError() {
    console.error('Login Failed')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-500">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500 mt-2">
          Sign in to unlock edit and delete features
        </p>
        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        </div>
      </div>
    </div>
  )
}

export default Login
