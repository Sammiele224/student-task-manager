import { createContext, useContext, useLayoutEffect } from 'react'

export const STORAGE_KEY = 'tlou.theme'

export const ThemeContext = createContext(null)

/** Read the current theme and switch it: `const { theme, toggleTheme } = useTheme()` */
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}

/**
 * Hold the page in one theme while it is mounted, whatever the saved choice.
 *
 * The choice itself is left alone, so leaving the page puts it back and the
 * theme toggle still shows what the student picked.
 *
 * A layout effect, so the override is in place before the first paint — with a
 * passive effect the saved theme flashes for a frame on a direct load.
 */
export function useForcedTheme(forced) {
  const { setForcedTheme } = useTheme()

  useLayoutEffect(() => {
    setForcedTheme(forced)
    return () => setForcedTheme(null)
  }, [forced, setForcedTheme])
}
