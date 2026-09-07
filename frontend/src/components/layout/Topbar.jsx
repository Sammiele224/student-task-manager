import { Menu, Search } from 'lucide-react'
import { Input } from '../ui'
import './Topbar.css'

/**
 * Sticky header: breadcrumb on the left, global search and identity on the
 * right. Pages pass their own breadcrumb label.
 */
export default function Topbar({ breadcrumb = 'Overview', onMenuClick }) {
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
        <span className="topbar__crumb">My workspace</span>
        <span className="topbar__sep" aria-hidden="true">
          /
        </span>
        <span className="topbar__crumb topbar__crumb--current">{breadcrumb}</span>
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
