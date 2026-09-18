import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useForcedTheme } from '../theme/theme-context'
import { login } from '../api/AuthApi'
import { useTasks } from '../components/features/Tasks/TaskContext'
import '../styles/features/User/SignIn.css'

export default function SignIn() {
  /* The sign-in screen is designed for the light palette only, so it holds
     light while it is open and hands the saved theme back on the way out. */
  useForcedTheme('light')

  const navigate = useNavigate()
  const { reload } = useTasks()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  /* The "remember me" checkbox is hidden for now, so a session always persists
     in localStorage. Restore the row below to make it a choice again. */
  const [remember] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Enter your email and password to continue.')
      return
    }
    setSubmitting(true)

    try { 
      const { token, user } = await login(email, password) // save token and user 
      if (remember) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user')
      }
      else {
        sessionStorage.setItem('token', token)
        sessionStorage.setItem('user', JSON.stringify(user))
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
      /* The task and course lists were fetched before there was a token, so
         load them again now that the student is signed in. */
      reload()
      navigate('/')
    }
    catch (error) {
      setError(error.message || 'Login failed.')
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="signin">
      <div className="signin__card">
        <div className="signin__hero">
          <div className="signin__hero-content">
            <span className="signin__hero-brand">THE REST OF US</span>
            <h1 className="signin__hero-title">
              A little more,
              <br />
              every day.
            </h1>
            <p className="signin__hero-quote">
              Your personal campus, always open — courses, tasks and
              deadlines in one quiet place.
            </p>
          </div>
        </div>

        <div className="signin__panel">
          <h2 className="signin__title">Welcome back</h2>
          <p className="signin__subtitle">Sign in to continue to your workspace.</p>

          <form className="signin__form" onSubmit={handleSubmit} noValidate>
            <label className="signin__field">
              <span className="signin__label">Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="alex@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="signin__input"
              />
            </label>

            <label className="signin__field">
              <span className="signin__label">Password</span>
              <div className="signin__password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="signin__input"
                />
                <button
                  type="button"
                  className="signin__password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            {/* Hidden until there is a forgot-password page to link to.
                Re-enabling this needs setRemember back on the state above. */}
            {/* <div className="signin__row">
              <label className="signin__checkbox">
                <input
                  type="checkbox"
                  name="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <Link to="/signin" className="signin__forgot">
                Forgot password?
              </Link>
            </div> */}

            {error && (
              <p className="signin__error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="signin__submit" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* <p className="signin__footer">
            New here?{' '}
            <Link to="/signin" className="signin__footer-link">
              Create an account
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  )
}