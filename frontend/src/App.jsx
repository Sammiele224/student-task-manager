import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout'
import Overview from './pages/Overview'
import Courses from './pages/Courses'
import Tasks from './pages/Tasks'
import Upcoming from './pages/Upcoming'
import Calendar from './pages/Calendar'
import NotFound from './pages/NotFound'

/**
 * Route table. To add a page: create it in src/pages, add a <Route> here and
 * an entry in NAV_ITEMS inside components/layout/Sidebar.jsx.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Overview />} />
        <Route path="courses" element={<Courses />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="upcoming" element={<Upcoming />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
