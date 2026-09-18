import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import './AppLayout.css'

/** Maps a route to the label shown in the topbar breadcrumb. */
const BREADCRUMBS = {
  '/': 'Overview',
  '/courses': 'My courses',
  '/tasks': 'All tasks',
  '/upcoming': 'Upcoming',
  '/calendar': 'Calendar',
  '/profile': 'Profile',
}

/* Where a detail route's parent lives, so its crumb can link back. */
const DETAIL_PARENTS = [
  { prefix: '/tasks/', to: '/tasks', parent: 'All tasks', label: 'Task Detail' },
  { prefix: '/courses/', to: '/courses', parent: 'My courses', label: 'Course Detail' },
]

/**
 * The breadcrumb trail for a path, root first. Every crumb but the last
 * carries a `to` — the last one is the page you are already on, so it is
 * text rather than a link.
 */
function breadcrumbFor(pathname) {
  const root = { label: 'My workspace', to: '/' }

  const detail = DETAIL_PARENTS.find((d) => pathname.startsWith(d.prefix))
  if (detail) {
    return [root, { label: detail.parent, to: detail.to }, { label: detail.label }]
  }

  return [root, { label: BREADCRUMBS[pathname] ?? 'Overview' }]
}

/**
 * App frame: fixed sidebar beside a scrolling content column.
 * Pages render into the <Outlet /> and supply their own PageContainer.
 */
export default function AppLayout() {
  const [navOpen, setNavOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <div className="app-layout">
      <Sidebar open={navOpen} onNavigate={() => setNavOpen(false)} />

      {navOpen && (
        <div
          className="app-layout__scrim"
          onClick={() => setNavOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="app-layout__main">
        <Topbar
          crumbs={breadcrumbFor(pathname)}
          onMenuClick={() => setNavOpen(true)}
        />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
