import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import Overview from './pages/Overview'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Tasks from './pages/Tasks'
import TaskDetail from './pages/TaskDetail'
import Upcoming from './pages/Upcoming'
import Calendar from './pages/Calendar'
import SignIn from './pages/SignIn'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import { TasksProvider } from './components/features/Tasks/TaskContext'
import { useAuth } from './context/AuthContext'

function LoginRoute() {
  const { user, loading } = useAuth()

  if (loading) return null
  if (user) return <Navigate to="/" replace />
  return <SignIn />
}

export default function App() {
  return (
    <Routes>
      <Route path="login" element={<LoginRoute />} />
      <Route path="signin" element={<Navigate to="/login" replace />} />

      <Route
        element={(
          <ProtectedRoute>
            <TasksProvider>
              <AppLayout />
            </TasksProvider>
          </ProtectedRoute>
        )}
      >

        <Route index element={<Overview />} />

        <Route
          path="dashboard"
          element={<Navigate to="/" replace />}
        />

        <Route path="courses" element={<Courses />} />

        <Route path="courses/:id" element={<CourseDetail />} />

        <Route path="tasks" element={<Tasks />} />

        <Route path="tasks/:id" element={<TaskDetail />} />

        <Route path="upcoming" element={<Upcoming />} />

        <Route path="calendar" element={<Calendar />} />

        <Route path="profile" element={<Profile />} />

        <Route path="*" element={<NotFound />} />

      </Route>
    </Routes>
  )
}