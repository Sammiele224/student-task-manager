const API_BASE = '/api/v1'
export const AUTH_TOKEN_KEY = 'authToken'

/**
 * Shared JSON API client. Session state and navigation remain outside this module.
 */
export async function apiClient(path, options = {}) {
  const {
    body,
    headers: callerHeaders = {},
    fallbackMessage = 'Request failed.',
    returnEnvelope = false,
    ...requestOptions
  } = options

  const headers = {
    Accept: 'application/json',
    ...callerHeaders,
  }
  const token = window.localStorage.getItem(AUTH_TOKEN_KEY)

  if (body !== undefined && !headers['Content-Type'] && !headers['content-type']) {
    headers['Content-Type'] = 'application/json'
  }

  if (token && !headers.Authorization && !headers.authorization) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...requestOptions,
    headers,
    body: body === undefined || typeof body === 'string' ? body : JSON.stringify(body),
  })
  const result = await response.json().catch(() => ({}))

  if (!response.ok || result.success === false) {
    throw new Error(result.message || fallbackMessage)
  }

  return returnEnvelope ? result : result.data
}
