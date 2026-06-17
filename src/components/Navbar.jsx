import { Link, useNavigate } from 'react-router-dom'
import { isLoggedIn, getUser, logOut } from '../utils/auth'

function Navbar() {
  const navigate = useNavigate()
  const user = getUser()

  function handleLogout() {
    logOut()
    localStorage.removeItem('jwt_token')
    navigate('/')
  }

  return (
    <nav className="bg-green-600 text-white px-8 py-4 shadow-md">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight hover:text-green-100"
        >
          Football Stats Explorer
        </Link>

        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-green-100 text-sm">
            Home
          </Link>
          <Link to="/dashboard" className="hover:text-green-100 text-sm">
            Matches
          </Link>

          {isLoggedIn() ? (
            <div className="flex items-center gap-4">
              <span className="text-green-200 text-sm">
                Hi, {user.name.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-green-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white text-green-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-50"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
