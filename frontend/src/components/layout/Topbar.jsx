import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import GlobalSearch from './GlobalSearch'
import UserMenu from './UserMenu'
import './Topbar.css'

/**
 * Sticky header: breadcrumb on the left, global search and identity on the
 * right. AppLayout passes the trail; every crumb but the last is a link.
 */
export default function Topbar({ crumbs = [{ label: 'Overview' }], onMenuClick }) {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <header className="topbar">
      <button
        type="button"
        className="topbar__menu"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      <nav className="topbar__crumbs" aria-label="Breadcrumb">
        {crumbs.map((crumb, index) => (
          <span key={crumb.label} className="topbar__crumb-group">
            {index > 0 && (
              <span className="topbar__sep" aria-hidden="true">
                /
              </span>
            )}
            {crumb.to ? (
              <Link to={crumb.to} className="topbar__crumb topbar__crumb--link">
                {crumb.label}
              </Link>
            ) : (
              <span className="topbar__crumb topbar__crumb--current" aria-current="page">
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </nav>

      <div className="topbar__right">
        <GlobalSearch />
        <span className="topbar__date">{today}</span>
        {/* Opens the same account menu as the sidebar's settings gear. */}
        <UserMenu
          placement="down"
          renderTrigger={(triggerProps) => (
            <button
              type="button"
              className="topbar__avatar"
              aria-label="Account menu for Alex Morgan"
              {...triggerProps}
            >
              AM
            </button>
          )}
        />
      </div>
    </header>
  )
}
