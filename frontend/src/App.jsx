import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout'
import Overview from './pages/Overview'
import Courses from './pages/Courses'
import Tasks from './pages/Tasks'
import TaskDetail from './pages/TaskDetail'
import Upcoming from './pages/Upcoming'
import Calendar from './pages/Calendar'
import NotFound from './pages/NotFound'

/**
 * Route table — frozen on Day 1, keep it in sync with the README.
 *
 * To add a page: create it in src/pages, add a <Route> here and an entry in
 * NAV_ITEMS inside components/layout/Sidebar.jsx.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* The dashboard is the home page. /dashboard is kept as an alias so
            both names from the plan lead to the same screen. */}
        <Route index element={<Overview />} />
        <Route path="dashboard" element={<Navigate to="/" replace />} />

        <Route path="courses" element={<Courses />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="tasks/:id" element={<TaskDetail />} />
        <Route path="upcoming" element={<Upcoming />} />
        <Route path="calendar" element={<Calendar />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
