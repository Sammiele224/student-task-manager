import { createContext, useContext } from 'react'

export const STORAGE_KEY = 'tlou.theme'

export const ThemeContext = createContext(null)

/** Read the current theme and switch it: `const { theme, toggleTheme } = useTheme()` */
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
