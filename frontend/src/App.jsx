import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout'
import Overview from './pages/Overview'
import Courses from './pages/Courses'
import Tasks from './pages/Tasks'
import TaskDetail from './pages/TaskDetail'
import Upcoming from './pages/Upcoming'
import Calendar from './pages/Calendar'
import NotFound from './pages/NotFound'
import { TasksProvider } from './components/features/Tasks/TaskContext'

export default function App() {
  return (
    <TasksProvider>
      <Routes>
        <Route element={<AppLayout />}>

          <Route index element={<Overview />} />

          <Route
            path="dashboard"
            element={<Navigate to="/" replace />}
          />

          <Route path="courses" element={<Courses />} />

          <Route path="tasks" element={<Tasks />} />

          <Route path="tasks/:id" element={<TaskDetail />} />

          <Route path="upcoming" element={<Upcoming />} />

          <Route path="calendar" element={<Calendar />} />

          <Route path="*" element={<NotFound />} />

        </Route>
      </Routes>
    </TasksProvider>
  )
}