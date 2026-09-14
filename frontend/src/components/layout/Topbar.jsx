import { Link } from 'react-router-dom'
import { Menu, Search } from 'lucide-react'
import { Input } from '../ui'
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
        <div className="topbar__search">
          <Input
            type="search"
            placeholder="Find an assignment..."
            aria-label="Find an assignment"
            icon={<Search />}
            bare
          />
        </div>
        <span className="topbar__date">{today}</span>
        <span className="topbar__avatar" aria-hidden="true">
          AM
        </span>
      </div>
    </header>
  )
}
