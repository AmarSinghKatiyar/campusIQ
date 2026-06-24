import { useState } from 'react'
import './App.css'
import StudentLogin from './components/StudentLogin.jsx'
import StudentDashboard from './components/StudentDashboard.jsx'
import { useSelector } from 'react-redux'

function App() {
  const [view, setView] = useState('landing')
  const [authMode, setAuthMode] = useState('signup')
  const user = useSelector((state) => state.auth.user)

  const startAuth = (mode) => {
    setAuthMode(mode)
    setView('auth')
  }

  if (user) {
    return (
      <div className="app-shell">
        <StudentDashboard />
      </div>
    )
  }

  if (view === 'auth') {
    return (
      <div className="app-shell">
        <StudentLogin initialMode={authMode} onBack={() => setView('landing')} />
      </div>
    )
  }

  return (
    <div className="app-shell landing-shell">
      <section className="hero-card">
        <p className="eyebrow">CampusIQ</p>
        <h1>Get started with CampusIQ</h1>
        <p className="hero-copy">
          Join the next generation of matched opportunity and discover campus experiences that fit your goals.
        </p>

        <div className="hero-actions">
          <button type="button" className="primary-action" onClick={() => startAuth('signup')}>
            Register
          </button>
          <button type="button" className="secondary-action" onClick={() => startAuth('login')}>
            Login
          </button>
          <button type="button" className="ghost-action" onClick={() => startAuth('signup')}>
            Register with Google
          </button>
        </div>
      </section>
    </div>
  )
}

export default App
