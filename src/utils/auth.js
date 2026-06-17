export function getUser() {
  const token = localStorage.getItem('google_token')
  if (!token) return null

  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return {
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
    }
  } catch {
    return null
  }
}

export function isLoggedIn() {
  return getUser() !== null
}

export function logOut() {
  localStorage.removeItem('google_token')
}
