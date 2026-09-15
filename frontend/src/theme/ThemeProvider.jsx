import { useEffect, useLayoutEffect, useState } from 'react'
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

/**
 * Applies the theme to <html data-theme> and remembers the choice.
 *
 * A page can override what is shown with useForcedTheme — the sign-in screen
 * holds light. The override is never saved: `theme` stays the student's own
 * choice, and only that goes to storage.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readInitialTheme)
  const [forcedTheme, setForcedTheme] = useState(null)

  /* Layout effect, so a forced theme is on the page before it paints. */
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', forcedTheme ?? theme)
  }, [theme, forcedTheme])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Persisting the choice is a convenience, not a requirement.
    }
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'cyber' : 'light'))

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, setForcedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
