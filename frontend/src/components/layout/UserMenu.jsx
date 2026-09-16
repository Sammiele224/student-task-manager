import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'
import { useClickOutside } from '../../hooks/useClickOutside'
import { useAuth } from '../../context/AuthContext'
import './UserMenu.css'

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
  const { logout } = useAuth()

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
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className="user-menu__item"
              onClick={() => {
                setOpen(false)
                navigate('/profile')
              }}
            >
              <User size={16} aria-hidden="true" />
              <span>Profile</span>
            </button>
          </li>
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className="user-menu__item"
              onClick={() => {
                setOpen(false)
                logout()
                navigate('/login')
              }}
            >
              <LogOut size={16} aria-hidden="true" />
              <span>Log out</span>
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}
