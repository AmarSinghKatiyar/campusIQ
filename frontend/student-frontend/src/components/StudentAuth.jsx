import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuthError } from '../store/features/auth/authSlice'
import { loginStudent, signupStudent } from '../store/features/auth/authThunks'
import './StudentAuth.css'

const stats = [
  { value: '2,341', label: 'Students' },
  { value: '1,248', label: 'Opportunities' },
  { value: '92%', label: 'Success Rate' },
]

const features = [
  'AI-powered opportunity matching',
  'Personalized learning paths',
  'Real-time progress tracking',
]

function StudentAuth({ initialMode = 'login', onBack }) {
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const [mode, setMode] = useState(initialMode)
  const [form, setForm] = useState({
    name: '',
    rollNumber: '',
    email: '',
    branch: '',
    graduationYear: '',
    cgpa: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  })
  const [localError, setLocalError] = useState('')
  const isSignup = mode === 'signup'
  const isLoading = auth.status === 'loading'

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  const updateField = (field) => (event) => {
    const value = field === 'acceptedTerms' ? event.target.checked : event.target.value
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
    setLocalError('')
    if (auth.error) {
      dispatch(clearAuthError())
    }
  }

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setLocalError('')
    dispatch(clearAuthError())
    setForm({
      name: '',
      rollNumber: '',
      email: '',
      branch: '',
      graduationYear: '',
      cgpa: '',
      password: '',
      confirmPassword: '',
      acceptedTerms: false,
    })
  }

  const handleLogin = (event) => {
    event.preventDefault()
    setLocalError('')
    dispatch(loginStudent({
      email: form.email,
      password: form.password,
    }))
  }

  const handleSignup = (event) => {
    event.preventDefault()

    if (!form.acceptedTerms) {
      setLocalError('Please accept the terms and privacy policy to create your account.')
      return
    }

    setLocalError('')
    dispatch(signupStudent({
      name: form.name,
      rollNumber: form.rollNumber,
      email: form.email,
      branch: form.branch,
      graduationYear: form.graduationYear,
      cgpa: form.cgpa,
      password: form.password,
      confirmPassword: form.confirmPassword,
    }))
  }

  const content = useMemo(() => {
    if (mode === 'signup') {
      return {
        title: 'Create your account',
        subtitle: 'Register as a student to explore opportunities and track your placement journey.',
      }
    }
    return {
      title: 'Welcome back',
      subtitle: 'Sign in to your student account',
    }
  }, [mode])

  return (
    <div className="student-auth-page">
      {/* LEFT PANEL */}
      <section className="student-auth-left">
        <div className="student-auth-bg-circle circle-1" />
        <div className="student-auth-bg-circle circle-2" />
        <div className="student-auth-bg-circle circle-3" />
        <div className="student-auth-bg-circle circle-4" />

        <div className="student-showcase-card">
          <div className="student-brand">
            <div className="student-brand-icon">🎓</div>
            <span>CampusIQ</span>
          </div>

          <h1>
            Your journey,
            <br />
            supercharged by <span>AI.</span>
          </h1>

          <p>
            Get personalized recommendations, track your progress, and land your dream
            opportunities with smarter placement insights.
          </p>

          <ul className="student-feature-list">
            {features.map((item) => (
              <li key={item}>
                <span className="check">✓</span>
                {item}
              </li>
            ))}
          </ul>

          <div className="student-stats-row">
            {stats.map((item) => (
              <div className="student-stat" key={item.label}>
                <h3>{item.value}</h3>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className="student-auth-right">
        <div className={isSignup ? 'student-auth-form-wrap signup-form-wrap' : 'student-auth-form-wrap'}>
          {mode === 'signup' && (
            <button className="back-link" type="button" onClick={() => switchMode('login')}>
              ← Back to sign in
            </button>
          )}

          <div className="student-auth-header">
            <h2>{content.title}</h2>
            <p>{content.subtitle}</p>
          </div>

          {mode === 'login' ? (
            <form className="student-auth-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="login-email">College Email</label>
                <div className="input-wrap">
                  <span className="input-icon">✉</span>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="student@university.edu"
                    value={form.email}
                    onChange={updateField('email')}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="Enter Password"
                    value={form.password}
                    onChange={updateField('password')}
                    required
                  />
                </div>
              </div>

              <div className="auth-row">
                <label className="checkbox-row">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button type="button" className="text-link">
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="auth-primary-btn" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>

              {auth.error ? <p className="auth-error">{auth.error}</p> : null}

              <div className="divider">New to CampusIQ?</div>

              <button
                type="button"
                className="auth-secondary-btn"
                onClick={() => switchMode('signup')}
              >
                Create an account
              </button>
            </form>
          ) : (
            <form className="student-auth-form" onSubmit={handleSignup}>
              <div className="form-grid two-col">
                <div className="form-group">
                  <label htmlFor="signup-name">Full Name</label>
                  <div className="input-wrap">
                    <span className="input-icon">👤</span>
                    <input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={updateField('name')}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="signup-roll-number">Roll Number</label>
                  <div className="input-wrap">
                    <span className="input-icon">🪪</span>
                    <input
                      id="signup-roll-number"
                      type="text"
                      placeholder="Enter Roll No."
                      value={form.rollNumber}
                      onChange={updateField('rollNumber')}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="signup-email">College Email</label>
                <div className="input-wrap">
                  <span className="input-icon">✉</span>
                  <input
                    id="signup-email"
                    type="email"
                    placeholder="student@university.edu"
                    value={form.email}
                    onChange={updateField('email')}
                    required
                  />
                </div>
              </div>

              <div className="form-grid two-col">
                <div className="form-group">
                  <label htmlFor="signup-branch">Branch</label>
                  <div className="input-wrap">
                    <span className="input-icon">🏫</span>
                    <input
                      id="signup-branch"
                      type="text"
                      placeholder="CSE / IT / ECE"
                      value={form.branch}
                      onChange={updateField('branch')}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="signup-graduation-year">Graduation Year</label>
                  <div className="input-wrap">
                    <span className="input-icon">🎓</span>
                    <input
                      id="signup-graduation-year"
                      type="number"
                      min="2024"
                      max="2030"
                      placeholder="2027"
                      value={form.graduationYear}
                      onChange={updateField('graduationYear')}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="signup-cgpa">CGPA</label>
                <div className="input-wrap">
                  <span className="input-icon">📊</span>
                  <input
                    id="signup-cgpa"
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    placeholder="8.5"
                    value={form.cgpa}
                    onChange={updateField('cgpa')}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input
                    id="signup-password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={updateField('password')}
                    minLength={8}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="signup-confirm-password">Confirm Password</label>
                <div className="input-wrap">
                  <span className="input-icon">🛡</span>
                  <input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={updateField('confirmPassword')}
                    minLength={8}
                    required
                  />
                </div>
              </div>

              <label className="checkbox-row terms-row">
                <input
                  type="checkbox"
                  checked={form.acceptedTerms}
                  onChange={updateField('acceptedTerms')}
                />
                <span>
                  I agree to CampusIQ&apos;s <b>Terms of Service</b> and <b>Privacy Policy</b>
                </span>
              </label>

              <button type="submit" className="auth-primary-btn" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>

              {localError || auth.error ? (
                <p className="auth-error">{localError || auth.error}</p>
              ) : null}

              <p className="bottom-switch">
                Already have an account?{' '}
                <button type="button" className="inline-link" onClick={() => switchMode('login')}>
                  Sign in
                </button>
              </p>
            </form>
          )}

          {onBack && mode === 'login' && (
            <button type="button" className="page-back-btn" onClick={onBack}>
              ← Back
            </button>
          )}
        </div>
      </section>
    </div>
  )
}

export default StudentAuth
