import { useState } from 'react'
import './App.css'
import StudentAuth from './components/StudentAuth'
import StudentDashboard from './components/StudentDashboard'
import { useSelector } from 'react-redux'

function App() {
  const [authMode, setAuthMode] = useState('login')
  const user = useSelector((state) => state.auth?.user)

  if (user) {
    return (
      <div className="app-shell">
        <StudentDashboard />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <StudentAuth
        initialMode={authMode}
        onBack={() => setAuthMode('login')}
      />
    </div>
  )
}

export default App