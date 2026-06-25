import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/features/auth/authSlice'
import './StudentDashboard.css'

const navItems = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'opportunities', label: 'Opportunities', icon: 'briefcase' },
  { id: 'applications', label: 'Applications', icon: 'document' },
  { id: 'interviews', label: 'Interviews', icon: 'calendar' },
  { id: 'learning', label: 'Learning', icon: 'book' },
  { id: 'assessments', label: 'Assessments', icon: 'clock' },
  { id: 'profile', label: 'Profile', icon: 'user' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
]

const stats = [
  { label: 'Applications', value: '12', trend: '20% this week', icon: 'briefcase', tone: 'purple' },
  { label: 'Shortlisted', value: '5', trend: '12% this week', icon: 'check', tone: 'green' },
  { label: 'Interviews', value: '3', trend: '5% this week', icon: 'calendar', tone: 'orange' },
  { label: 'Profile Strength', value: '85%', trend: '', icon: 'trophy', tone: 'blue', progress: 85 },
]

const chartPoints = [
  { x: 5, y: 68 },
  { x: 12, y: 70 },
  { x: 27, y: 52 },
  { x: 40, y: 64 },
  { x: 53, y: 42 },
  { x: 64, y: 56 },
  { x: 75, y: 38 },
  { x: 84, y: 53 },
  { x: 93, y: 43 },
]

const skills = [
  { name: 'Data Structures', score: 90 },
  { name: 'Problem Solving', score: 85 },
  { name: 'React.js', score: 75 },
  { name: 'Communication', score: 70 },
  { name: 'SQL', score: 65 },
]

const opportunities = [
  { company: 'Amazon', title: 'Amazon SDE Intern', meta: 'Software Development · Internship', match: '92%', logo: 'a' },
  { company: 'Microsoft', title: 'Microsoft Explore Intern', meta: 'Software Engineering · Internship', match: '88%', logo: 'ms' },
  { company: 'Adobe', title: 'Adobe Frontend Intern', meta: 'Frontend Development · Internship', match: '86%', logo: 'A' },
]

const interviews = [
  { company: 'Google', title: 'Google SDE Intern', round: 'Technical Round', date: 'Jun 28, 2025', time: '10:00 AM', logo: 'G' },
  { company: 'Flipkart', title: 'Flipkart SDE Intern', round: 'HR Round', date: 'Jun 30, 2025', time: '02:00 PM', logo: 'f' },
  { company: 'Paytm', title: 'Paytm Backend Intern', round: 'Technical Round', date: 'Jul 2, 2025', time: '11:30 AM', logo: 'paytm' },
]

function DashboardIcon({ name }) {
  return <span className={`dashboard-icon icon-${name}`} aria-hidden="true" />
}

export default function StudentDashboard() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const [activeView, setActiveView] = useState('overview')
  const [range, setRange] = useState('This Month')
  const [notice, setNotice] = useState('')

  const firstName = user?.name?.split(' ')?.[0] || 'Student'
  const initials = useMemo(() => {
    if (!user?.name) return 'ST'
    return user.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('')
  }, [user?.name])

  const handleAction = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2200)
  }

  return (
    <div className="student-dashboard">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <span className="brand-mark">
            <DashboardIcon name="cap" />
          </span>
          <span>CampusIQ</span>
        </div>

        <nav className="dashboard-nav" aria-label="Student dashboard">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={activeView === item.id ? 'nav-item active' : 'nav-item'}
              onClick={() => {
                setActiveView(item.id)
                handleAction(`${item.label} section selected`)
              }}
            >
              <DashboardIcon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="sidebar-logout" type="button" onClick={() => dispatch(logout())}>
          <DashboardIcon name="logout" />
          <span>Logout</span>
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <h1>Student Dashboard</h1>

          <div className="topbar-actions">
            <button
              className="notification-btn"
              type="button"
              aria-label="Notifications"
              onClick={() => handleAction('You have 3 new notifications')}
            >
              <DashboardIcon name="bell" />
              <span>3</span>
            </button>

            <button
              className="user-menu"
              type="button"
              onClick={() => setActiveView('profile')}
            >
              <span className="avatar">{initials}</span>
              <span className="user-summary">
                <strong>{user?.name || 'Student User'}</strong>
                <small>{[user?.year, user?.branch].filter(Boolean).join(', ') || 'Student'}</small>
              </span>
              <DashboardIcon name="chevron" />
            </button>
          </div>
        </header>

        <section className="dashboard-content">
          <div className="welcome-block">
            <h2>Welcome back, {firstName}!</h2>
            <p>Here&apos;s what&apos;s happening with your placements today.</p>
          </div>

          {notice ? <p className="dashboard-notice">{notice}</p> : null}

          <section className="stats-grid" aria-label="Placement summary">
            {stats.map((item) => (
              <article className="stat-card" key={item.label}>
                <div className={`stat-icon ${item.tone}`}>
                  <DashboardIcon name={item.icon} />
                </div>
                <div className="stat-copy">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                  {item.trend ? <small>↑ {item.trend}</small> : null}
                  {item.progress ? (
                    <span className="profile-progress" aria-label={`${item.progress}% profile strength`}>
                      <span style={{ width: `${item.progress}%` }} />
                    </span>
                  ) : null}
                </div>
              </article>
            ))}
          </section>

          <section className="dashboard-panels">
            <article className="panel chart-panel">
              <div className="panel-header">
                <h3>Application Trend</h3>
                <select value={range} onChange={(event) => setRange(event.target.value)}>
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Quarter</option>
                </select>
              </div>

              <div className="trend-chart" aria-label={`Application trend for ${range}`}>
                <div className="chart-scale">
                  <span>20</span>
                  <span>15</span>
                  <span>10</span>
                  <span>5</span>
                  <span>0</span>
                </div>
                <svg viewBox="0 0 100 78" role="img" aria-hidden="true">
                  <defs>
                    <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#6338f6" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#6338f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    className="chart-fill"
                    d={`M ${chartPoints.map((point) => `${point.x} ${point.y}`).join(' L ')} L 93 76 L 5 76 Z`}
                  />
                  <polyline
                    className="chart-line"
                    points={chartPoints.map((point) => `${point.x},${point.y}`).join(' ')}
                  />
                </svg>
                <div className="chart-labels">
                  <span>Jun 1</span>
                  <span>Jun 8</span>
                  <span>Jun 15</span>
                  <span>Jun 22</span>
                  <span>Jun 29</span>
                </div>
              </div>
            </article>

            <article className="panel skills-panel">
              <div className="panel-header">
                <h3>Top Skills</h3>
                <button type="button" onClick={() => handleAction('Opening all skills')}>
                  View all
                </button>
              </div>
              <div className="skill-list">
                {skills.map((skill) => (
                  <div className="skill-row" key={skill.name}>
                    <div>
                      <span>{skill.name}</span>
                      <strong>{skill.score}%</strong>
                    </div>
                    <span className="skill-track">
                      <span style={{ width: `${skill.score}%` }} />
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="dashboard-panels bottom-panels">
            <article className="panel list-panel">
              <div className="panel-header">
                <h3>Recommended Opportunities</h3>
                <button type="button" onClick={() => handleAction('Opening all opportunities')}>
                  View all
                </button>
              </div>
              <div className="opportunity-list">
                {opportunities.map((item) => (
                  <button
                    className="opportunity-row"
                    key={item.title}
                    type="button"
                    onClick={() => handleAction(`${item.title} selected`)}
                  >
                    <span className={`company-logo ${item.company.toLowerCase()}`}>{item.logo}</span>
                    <span className="row-copy">
                      <strong>{item.title}</strong>
                      <small>{item.meta}</small>
                    </span>
                    <span className="match-pill">Match: {item.match}</span>
                    <DashboardIcon name="chevron" />
                  </button>
                ))}
              </div>
            </article>

            <article className="panel list-panel">
              <div className="panel-header">
                <h3>Upcoming Interviews</h3>
                <button type="button" onClick={() => handleAction('Opening all interviews')}>
                  View all
                </button>
              </div>
              <div className="interview-list">
                {interviews.map((item) => (
                  <button
                    className="interview-row"
                    key={item.title}
                    type="button"
                    onClick={() => handleAction(`${item.company} interview selected`)}
                  >
                    <span className={`company-logo ${item.company.toLowerCase()}`}>{item.logo}</span>
                    <span className="row-copy">
                      <strong>{item.title}</strong>
                      <small>{item.round}</small>
                    </span>
                    <span className="date-copy">
                      <strong>{item.date}</strong>
                      <small>{item.time}</small>
                    </span>
                  </button>
                ))}
              </div>
              <button
                className="all-interviews-btn"
                type="button"
                onClick={() => {
                  setActiveView('interviews')
                  handleAction('Interviews section selected')
                }}
              >
                <DashboardIcon name="calendar" />
                <span>See All Interviews</span>
              </button>
            </article>
          </section>
        </section>
      </main>
    </div>
  )
}
