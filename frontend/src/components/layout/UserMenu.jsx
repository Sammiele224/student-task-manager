import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, User } from 'lucide-react'
import { useClickOutside } from '../../hooks/useClickOutside'
import './UserMenu.css'

const ITEMS = [
  { to: '/signin', label: 'Sign in', icon: LogIn },
  { to: '/profile', label: 'Profile', icon: User },
]

/**
 * The account menu — Sign in and Profile. The sidebar opens it from its
 * settings gear and the topbar from the avatar, so both show the same list.
 *
 * The wrapper is what the list positions against, which is why the sidebar
 * passes its whole user row in as children rather than just the gear.
 *
 * @param {'up'|'down'} placement   'up' at the foot of the sidebar, 'down' under the topbar
 * @param {string}      className   styles the wrapper, e.g. the sidebar's user row
 * @param {Function}    renderTrigger  gets the props the opening button needs
 */
export default function UserMenu({ placement = 'down', className = '', renderTrigger, children }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useClickOutside(close, open)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  const triggerProps = {
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    onClick: () => setOpen((v) => !v),
  }

  return (
    <div className={`user-menu ${className}`.trim()} ref={ref}>
      {children}
      {renderTrigger(triggerProps)}

      {open && (
        <ul className={`user-menu__list user-menu__list--${placement}`} role="menu">
          {ITEMS.map(({ to, label, icon: Icon }) => (
            <li key={to} role="none">
              <button
                type="button"
                role="menuitem"
                className="user-menu__item"
                onClick={() => {
                  setOpen(false)
                  navigate(to)
                }}
              >
                <Icon size={16} aria-hidden="true" />
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
