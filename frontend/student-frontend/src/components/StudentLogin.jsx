import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginStudent, signupStudent } from '../store/features/auth/authThunks'
import { logout } from '../store/features/auth/authSlice'
import './StudentLogin.css'

export default function StudentLogin({ initialMode = 'signup', onBack }) {
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const [isSignup, setIsSignup] = useState(initialMode === 'login' ? false : true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const hasRegisteredUsers = auth.registeredUsers.length > 0
  const canLogin = hasRegisteredUsers

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  useEffect(() => {
    setIsSignup(initialMode === 'login' ? false : true)
    resetForm()
  }, [initialMode])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSignup) {
      dispatch(signupStudent({ name, email, password, confirmPassword }))
    } else {
      dispatch(loginStudent({ email, password }))
    }
  }

  const switchMode = (signupMode) => {
    if (!signupMode && !canLogin) {
      return
    }
    setIsSignup(signupMode)
    resetForm()
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        {onBack ? (
          <button type="button" className="back-button" onClick={onBack}>
            ← Back to home
          </button>
        ) : null}

        <div className="mode-switch">
          <button
            type="button"
            className={isSignup ? 'mode-button active' : 'mode-button'}
            onClick={() => switchMode(true)}
          >
            Sign Up
          </button>
          <button
            type="button"
            className={!isSignup ? 'mode-button active' : 'mode-button'}
            onClick={() => switchMode(false)}
            disabled={!canLogin}
          >
            Login
          </button>
        </div>

        {!canLogin ? (
          <p className="hint-text">
            No student account exists yet. Please create an account first.
          </p>
        ) : null}

        <h1>{isSignup ? 'Create Student Account' : 'Student Login'}</h1>

        {auth.user ? (
          <div className="login-success">
            <p className="success-label">Logged in as</p>
            <p className="success-name">{auth.user.name}</p>
            <p className="success-email">{auth.user.email}</p>
            <button type="button" onClick={() => dispatch(logout())}>
              Logout
            </button>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            {isSignup && (
              <label>
                Full Name
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                  required
                />
              </label>
            )}

            <label>
              Email Address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="student@example.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
              />
            </label>

            {isSignup && (
              <label>
                Confirm Password
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter your password"
                  required
                />
              </label>
            )}

            <button type="submit" disabled={auth.status === 'loading'}>
              {auth.status === 'loading'
                ? isSignup
                  ? 'Creating account...'
                  : 'Signing in...'
                : isSignup
                ? 'Create Account'
                : 'Sign In'}
            </button>

            {auth.error ? <p className="error-text">{auth.error}</p> : null}

            {!hasRegisteredUsers && !isSignup ? (
              <p className="hint-text">You must create an account before you can log in.</p>
            ) : null}
          </form>
        )}
      </div>
    </div>
  )
}
