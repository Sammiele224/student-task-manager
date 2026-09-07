import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../theme/theme-context'
import './ThemeToggle.css'

/** Segmented Light / Cyber switch that lives in the sidebar. */
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="theme-toggle" role="group" aria-label="Colour theme">
      <button
        type="button"
        className={`theme-toggle__option ${theme === 'light' ? 'is-active' : ''}`}
        onClick={() => setTheme('light')}
        aria-pressed={theme === 'light'}
      >
        <Sun size={14} />
        Light
      </button>
      <button
        type="button"
        className={`theme-toggle__option ${theme === 'cyber' ? 'is-active' : ''}`}
        onClick={() => setTheme('cyber')}
        aria-pressed={theme === 'cyber'}
      >
        <Moon size={14} />
        Cyber
      </button>
    </div>
  )
}
