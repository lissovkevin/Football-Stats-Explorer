import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, getUser, logOut } from "../utils/auth";

function Navbar() {
    const navigate = useNaivgate()

    const user = getUser()

    function handleLogout() {
        logOut()

        navigate('/')
    }
    return (
        <nav className="bg-green-600 text-white px-8 py-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">Football Stats Explorer</Link>
            <div className="flex gap-4">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/login">Login</Link>
            </div>
        </nav>
    )
}

export default Navbar