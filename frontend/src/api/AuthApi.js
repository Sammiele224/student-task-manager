import { apiClient } from './apiClient'

export function login(email, password) {
  return apiClient('/auth/login', {
    method: 'POST',
    body: { email, password },
    fallbackMessage: 'Failed to sign in',
  })
}

export function getCurrentUser() {
  return apiClient('/auth/me', {
    fallbackMessage: 'Failed to fetch the current user',
  })
}
