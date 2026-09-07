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
          breadcrumb={BREADCRUMBS[pathname] ?? 'Overview'}
          onMenuClick={() => setNavOpen(true)}
        />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
