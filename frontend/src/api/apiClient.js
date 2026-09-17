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

  if (!response.ok) {
    throw new Error(result.message || 'Something went wrong.')
  }

  return result
}