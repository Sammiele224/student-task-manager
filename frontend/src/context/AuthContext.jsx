import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, login as loginRequest } from '../api/AuthApi'
import { AUTH_TOKEN_KEY } from '../api/apiClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const storedToken = window.localStorage.getItem(AUTH_TOKEN_KEY)

    async function restoreSession() {
      if (!storedToken) {
        if (!cancelled) {
          setToken(null)
          setUser(null)
          setLoading(false)
        }
        return
      }

      try {
        const currentUser = await getCurrentUser()
        if (!cancelled) {
          setToken(storedToken)
          setUser(currentUser)
          setLoading(false)
        }
      } catch {
        window.localStorage.removeItem(AUTH_TOKEN_KEY)
        if (!cancelled) {
          setToken(null)
          setUser(null)
          setLoading(false)
        }
      }
    }

    restoreSession()
    return () => {
      cancelled = true
    }
  }, [])

  async function login(email, password) {
    const result = await loginRequest(email, password)
    window.localStorage.setItem(AUTH_TOKEN_KEY, result.token)
    setToken(result.token)
    setUser(result.user)
    return result
  }

  function logout() {
    window.localStorage.removeItem(AUTH_TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>')
  }
  return context
}
