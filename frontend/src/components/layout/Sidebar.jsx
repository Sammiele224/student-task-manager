import { NavLink } from 'react-router-dom'
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
import './Sidebar.css'

/**
 * Primary navigation. Add a page by adding one entry here and one <Route>
 * in App.jsx — nothing else needs to change.
 */
const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/courses', label: 'My courses', icon: BookOpen },
  { to: '/tasks', label: 'All tasks', icon: ListChecks },
  { to: '/upcoming', label: 'Upcoming', icon: Clock },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
]

export default function Sidebar({ open = false, onNavigate }) {
  return (
    <aside className={`sidebar ${open ? 'is-open' : ''}`}>
      <div className="sidebar__brand">
        <Logo />
        <div className="sidebar__brand-text">
          <span className="sidebar__brand-name">THE LAST OF US</span>
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
                {/* Teammates: render live counts or a status dot here. */}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Progress summary — wire to the dashboard stats endpoint (US-13). */}
      <div className="sidebar__slot" />

      <div className="sidebar__footer">
        <span className="u-eyebrow sidebar__nav-label">Make it yours</span>
        <ThemeToggle />

        <a className="sidebar__aux" href="#guidance">
          <span>A little guidance</span>
          <ExternalLink size={14} />
        </a>

        <div className="sidebar__user">
          <span className="sidebar__avatar" aria-hidden="true">
            AM
          </span>
          <div className="sidebar__user-text">
            <span className="sidebar__user-name">Alex Morgan</span>
            <span className="sidebar__user-sub">Personal workspace</span>
          </div>
          <button type="button" className="sidebar__settings" aria-label="Settings">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
