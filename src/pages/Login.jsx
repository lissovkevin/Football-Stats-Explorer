import { GoogleLogin } from "@react-oauth/google"
import { useNavigation } from "react-router-dom"

function Login() {

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-gray-500 mt-2">Sign in to unlock edit and delete features</p>
            <GoogleLogin />
        </div>
    )
}

export default Login