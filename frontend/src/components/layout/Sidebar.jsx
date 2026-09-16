import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  BookOpen,
  CalendarDays,
  Clock,
  ExternalLink,
  LayoutGrid,
  ListChecks,
  Settings,
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import Logo from './Logo'
import GuidancePanel from './GuidancePanel'
import UserMenu from './UserMenu'
import { useAuth } from '../../context/AuthContext'
import { useTasks } from '../features/Tasks/TaskContext'
import { useBackendStatus } from '../../hooks/useBackendStatus'
import './Sidebar.css'

/* What the workspace line says about the server behind it. */
const STATUS_TEXT = {
  checking: 'Checking your campus…',
  online: 'Your personal campus',
  offline: 'Campus offline — changes will not save',
}

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/courses', label: 'My courses', icon: BookOpen },
  { to: '/tasks', label: 'All tasks', icon: ListChecks },
  { to: '/upcoming', label: 'Upcoming', icon: Clock },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
]

export default function Sidebar({ open = false, onNavigate }) {
  const { completedCount, percentDone } = useTasks()
  const { user } = useAuth()

  const [guidanceOpen, setGuidanceOpen] = useState(false)
  const backend = useBackendStatus()
  const initials = user?.name?.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || '?'

  return (
    <aside className={`sidebar ${open ? 'is-open' : ''}`}>
      <Link to="/" className="sidebar__brand" onClick={onNavigate} aria-label="The Rest of Us — go to Overview">
        <Logo />
        <div className="sidebar__brand-text">
          <span className="sidebar__brand-name">THE REST OF US</span>
          <span className="sidebar__brand-sub">STUDENT WORKSPACE</span>
        </div>
      </Link>

      {/* The dot was decoration; it now reports whether the API is answering,
          which is the first thing to check when nothing saves. */}
      <div className={`sidebar__workspace is-${backend}`} title={STATUS_TEXT[backend]}>
        <span className="sidebar__workspace-dot" aria-hidden="true" />
        <span className="sidebar__workspace-text">{STATUS_TEXT[backend]}</span>
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

        <button type="button" className="sidebar__aux" onClick={() => setGuidanceOpen(true)}>
          <span>A little guidance</span>
          <ExternalLink size={14} aria-hidden="true" />
        </button>

        {/* The same account menu the topbar avatar opens. */}
        <UserMenu
          className="sidebar__user"
          placement="up"
          renderTrigger={(triggerProps) => (
            <button
              type="button"
              className="sidebar__settings"
              aria-label="Settings"
              {...triggerProps}
            >
              <Settings size={16} />
            </button>
          )}
        >
          <span className="sidebar__avatar" aria-hidden="true">
            {initials}
          </span>
          <div className="sidebar__user-text">
            <span className="sidebar__user-name">{user?.name}</span>
            <span className="sidebar__user-sub">{user?.email}</span>
          </div>
        </UserMenu>
      </div>
      <GuidancePanel open={guidanceOpen} onClose={() => setGuidanceOpen(false)} />
    </aside>
  )
}