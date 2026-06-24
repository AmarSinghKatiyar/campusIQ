import './App.css'
import StudentLogin from './components/StudentLogin.jsx'
import StudentDashboard from './components/StudentDashboard.jsx'
import { useSelector } from 'react-redux'

function App() {
  const user = useSelector((state) => state.auth.user)

  return <div className="app-shell">{user ? <StudentDashboard /> : <StudentLogin />}</div>
}

export default App
