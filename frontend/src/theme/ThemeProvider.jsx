import { useEffect, useState } from 'react'
import { STORAGE_KEY, ThemeContext } from './theme-context'

function readInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'cyber') return saved
  } catch {
    // Private mode or blocked storage — fall through to the OS preference.
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'cyber'
    : 'light'
}

/** Applies the theme to <html data-theme> and remembers the choice. */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Persisting the choice is a convenience, not a requirement.
    }
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'cyber' : 'light'))

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
