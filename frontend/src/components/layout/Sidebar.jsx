import { useState, useRef, useEffect } from 'react'
import { NavLink, useLocation, useNavigate  } from 'react-router-dom'
import {
  BookOpen,
  CalendarDays,
  Clock,
  ExternalLink,
  LayoutGrid,
  ListChecks,
  LogIn,
  Settings,
  User,
  Settings as SettingsIcon,
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import Logo from './Logo'
import { useTasks } from '../features/Tasks/TaskContext'
import './Sidebar.css'

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/courses', label: 'My courses', icon: BookOpen },
  { to: '/tasks', label: 'All tasks', icon: ListChecks },
  { to: '/upcoming', label: 'Upcoming', icon: Clock },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
]

export default function Sidebar({ open = false, onNavigate }) {
  const { pathname } = useLocation()
  const { completedCount, percentDone } = useTasks()
  const onTasksPage = pathname.startsWith('/tasks')
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    function handleEscape(e) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <aside className={`sidebar ${open ? 'is-open' : ''}`}>
      <div className="sidebar__brand">
        <Logo />
        <div className="sidebar__brand-text">
          <span className="sidebar__brand-name">THE REST OF US</span>
          <span className="sidebar__brand-sub">STUDENT WORKSPACE</span>
        </div>
      </div>

      <div className="sidebar__workspace">
        <span className="sidebar__workspace-dot" aria-hidden="true" />
        Your personal campus
      </div>

      <nav className="sidebar__nav" aria-label="Main">
        <span className="u-eyebrow sidebar__nav-label">Workspace</span>
        <ul>
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? 'is-active' : ''}`
                }
              >
                <Icon size={18} className="sidebar__link-icon" />
                <span className="sidebar__link-label">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar__slot">
        <div className="sidebar__progress">
          <p className="sidebar__progress-title">A little more, every day</p>
          <p className="sidebar__progress-percent">{percentDone}%</p>
          <p className="sidebar__progress-label">of your tasks complete</p>
          <div className="sidebar__progress-bar">
            <div
              className="sidebar__progress-fill"
              style={{ width: `${percentDone}%` }}
            />
          </div>
          <p className="sidebar__progress-note">
            {completedCount} down. You're making progress.
          </p>
        </div>
      </div>

      <div className="sidebar__footer">
        <span className="u-eyebrow sidebar__nav-label">Make it yours</span>
        <ThemeToggle />

        <a className="sidebar__aux" href="#guidance">
          <span>A little guidance</span>
          <ExternalLink size={14} />
        </a>

        <div className="sidebar__user" ref={menuRef}>
          <span className="sidebar__avatar" aria-hidden="true">
            AM
          </span>
          <div className="sidebar__user-text">
            <span className="sidebar__user-name">Alex Morgan</span>
            <span className="sidebar__user-sub">Personal workspace</span>
          </div>
          <button
            type="button"
            className="sidebar__settings"
            aria-label="Settings"
            aria-haspopup="true"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Settings size={16} />
          </button>

          {menuOpen && (
            <ul className="sidebar__user-menu" role="menu">
              <li role="none">
                <button
                  type="button"
                  role="menuitem"
                  className="sidebar__user-menu-item"
                  onClick={() => navigate('/signin')}
                >
                  <LogIn size={16} />
                  <span>Sign in</span>
                </button>
              </li>
              <li role="none">
                <button
                  type="button"
                  role="menuitem"
                  className="sidebar__user-menu-item"
                  onClick={() => navigate('/profile')}
                >
                  <User size={16} />
                  <span>Profile</span>
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </aside>
  )
}