import { Navigate, Outlet } from 'react-router-dom'
import { getToken } from '../../api/AuthApi'

/**
 * Every page behind it needs a signed-in student. Without a token the API
 * refuses every call, so the pages would render empty and every save would fail
 * with "Authentication required". Send the student to sign in instead.
 *
 * An expired or rejected token is handled in apiClient, which sees the 401.
 */
export default function RequireAuth() {
  if (!getToken()) {
    return <Navigate to="/signin" replace />
  }

  return <Outlet />
}
