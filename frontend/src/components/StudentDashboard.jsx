import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/features/auth/authSlice'
import './StudentDashboard.css'

export default function StudentDashboard() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-label">Student Dashboard</p>
          <h1>Welcome back, {user?.name ?? 'Student'}!</h1>
          <p className="dashboard-subtitle">
            Your learning activity and account details are right here.
          </p>
        </div>
        <button className="logout-button" type="button" onClick={() => dispatch(logout())}>
          Logout
        </button>
      </header>

      <section className="dashboard-grid">
        <article className="dashboard-card accent-card account-card">
          <p className="card-title">Account</p>
          <p className="card-value">{user?.email}</p>
          <p className="card-note">Role: {user?.role}</p>
        </article>

        <article className="dashboard-card">
          <p className="card-title">Courses Enrolled</p>
          <p className="card-value">4</p>
          <p className="card-note">Keep learning and complete your next lesson.</p>
        </article>

        <article className="dashboard-card">
          <p className="card-title">Upcoming Tasks</p>
          <p className="card-value">3</p>
          <p className="card-note">Assignments and practice due this week.</p>
        </article>

        <article className="dashboard-card">
          <p className="card-title">Notifications</p>
          <p className="card-value">2</p>
          <p className="card-note">You have unread messages from instructors.</p>
        </article>
      </section>

      <section className="dashboard-actions">
        <div className="action-card">
          <h2>Next step</h2>
          <p>Review your course progress and start the next module.</p>
          <button type="button" onClick={() => alert('Navigate to courses')}>
            View Courses
          </button>
        </div>
        <div className="action-card">
          <h2>Help center</h2>
          <p>Need support? Reach out to your tutor or check FAQs.</p>
          <button type="button" onClick={() => alert('Open help center')}>
            Get Support
          </button>
        </div>
      </section>
    </div>
  )
}
