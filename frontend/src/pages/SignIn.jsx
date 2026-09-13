import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import '../styles/features/User/SignIn.css'

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
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
    //   call api
      await new Promise((resolve) => setTimeout(resolve, 600))
      navigate('/')
    } catch {
      setError('We could not sign you in. Check your details and try again.')
    } finally {
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

            {error && (
              <p className="signin__error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="signin__submit" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}