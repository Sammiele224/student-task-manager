const API_URL = 'http://localhost:4000/api/v1/auth'

export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Login failed.')
  }

  return result.data
}

export async function getMe() {
  const token =
    localStorage.getItem('token') ||
    sessionStorage.getItem('token')

  if (!token) {
    return null
  }

  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Authentication required.')
  }

  return result.data
}

export function getToken() {
  return (
    localStorage.getItem('token') ||
    sessionStorage.getItem('token')
  )
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')

  sessionStorage.removeItem('token')
  sessionStorage.removeItem('user')
}