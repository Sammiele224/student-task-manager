import { logout } from './AuthApi'

const API_BASE_URL = 'http://localhost:4000/api/v1'

export async function apiFetch(endpoint, options = {}) {
  const token =
    localStorage.getItem('token') ||
    sessionStorage.getItem('token')

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
  })

  const result = await response.json()

  /* A token the server no longer accepts (expired, or signed with another
     secret) fails every call from here on. Clear it and start again at sign in,
     with a full load so nothing from the old session is left in memory. */
  if (response.status === 401 && token) {
    logout()
    window.location.assign('/signin')
  }

  if (!response.ok) {
    throw new Error(result.message || 'Something went wrong.')
  }

  return result
}