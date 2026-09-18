import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, LogOut, User } from 'lucide-react'
import { useClickOutside } from '../../hooks/useClickOutside'
import { logout } from '../../api/AuthApi'
import './UserMenu.css'

const ITEMS = [
  { to: '/signin', label: 'Sign in', icon: LogIn },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function UserMenu({
  placement = 'down',
  className = '',
  renderTrigger,
  children,
}) {
  const [open, setOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('token')
  )

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

  const handleSignOut = () => {
    /* logout() clears sessionStorage too, which a session started without
       "remember me" uses. */
    logout()

    setIsLoggedIn(false)
    setOpen(false)

    navigate('/signin')
  }

  return (
    <div className={`user-menu ${className}`.trim()} ref={ref}>
      {children}
      {renderTrigger(triggerProps)}

      {open && (
        <ul
          className={`user-menu__list user-menu__list--${placement}`}
          role="menu"
        >
          {isLoggedIn ? (
            <>
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
                  onClick={handleSignOut}
                >
                  <LogOut size={16} aria-hidden="true" />
                  <span>Sign out</span>
                </button>
              </li>
            </>
          ) : (
            <li role="none">
              <button
                type="button"
                role="menuitem"
                className="user-menu__item"
                onClick={() => {
                  setOpen(false)
                  navigate('/signin')
                }}
              >
                <LogIn size={16} aria-hidden="true" />
                <span>Sign in</span>
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}