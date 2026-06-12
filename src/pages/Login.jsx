import { GoogleLogin } from "@react-oauth/google"
import { useNavigate } from "react-router-dom"

function Login() {
    const navigate = useNavigate()

    function handleSuccess(response) {
        localStorage.setItem('google_token', response.credential)
        navigate('/dashboard')
    }

    function handleError() {
        console.error('Login Failed')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-500">
            <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md text-center">
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-gray-500 mt-2">Sign in to unlock edit and delete features</p>
                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                    />
                </div>
            </div>
        </div>
    )
}

export default Login