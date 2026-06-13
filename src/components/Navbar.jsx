import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, getUser, logOut } from "../utils/auth";

function Navbar() {
    const navigate = useNavigate()

    const user = getUser()

    function handleLogout() {
        logOut()

        navigate('/')
    }
    return (
        <nav className="bg-green-600 text-white px-8 py-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">Football Stats Explorer</Link>
            <div className="flex gap-4 items-center">
                <Link to="/dashboard">Dashboard</Link>
                {isLoggedIn() ? (
                    <>
                    <span className="text-green-200">
                        Hi, {user.name.split('')[0]}
                    </span>
                    <button 
                    onClick={handleLogout} 
                    className="bg-white text-green-600 px-4 py-1 rounded-lg font-medium"
                    >
                        Logout
                    </button>
                    </>
                ) : ( 
                <Link to="/login">Login</Link>
            )}
            </div>
        </nav>
    )
}

export default Navbar