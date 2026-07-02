import { useDispatch, useSelector } from 'react-redux'
import React, { useState, useRef, useEffect, useMemo} from "react";
import { logout } from '../store/features/auth/authSlice'
import {
  fetchNotifications,
  markNotificationRead,
  deleteNotification,
} from '../store/features/notifications/notificationsThunks'
import Sidebar from './Sidebar'
import OpportunitiesPage from './OpportunitiesPage'
import AssessmentsPage from './AssessmentsPage'
import InterviewsPage from "./InterviewsPage";
import LearningPage from "./Learning";
import SettingsPage from './SettingsPage'
import StudentProfilePage from './StudentProfilePage'
import api from './api'
import './ProfilePage.css'
import './StudentDashboard.css'

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


function DashboardIcon({ name }) {
  return <span className={`dashboard-icon icon-${name}`} aria-hidden="true" />
}

export default function StudentDashboard() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const notifications = useSelector((state) => state.notifications?.list || [])
  const notificationsStatus = useSelector((state) => state.notifications?.status)
  const notificationsError = useSelector((state) => state.notifications?.error)
  const [activeView, setActiveView] = useState('overview')
  const [range, setRange] = useState('This Month')
  const [notice, setNotice] = useState('')
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const userMenuButtonRef = useRef(null)
  const userMenuRef = useRef(null)
  const notificationsButtonRef = useRef(null)
  const notificationPanelRef = useRef(null)

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  )

  useEffect(() => {
    if (user?.email) {
      dispatch(fetchNotifications(user.email))
    }
  }, [dispatch, user?.email])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isNotificationsOpen &&
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(event.target) &&
        notificationsButtonRef.current &&
        !notificationsButtonRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false)
      }
      if (
        isUserMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        userMenuButtonRef.current &&
        !userMenuButtonRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false)
      }
    }

    window.addEventListener('mousedown', handleOutsideClick)
    return () => window.removeEventListener('mousedown', handleOutsideClick)
  }, [isNotificationsOpen, isUserMenuOpen])

  const handleToggleNotifications = () => {
    setIsNotificationsOpen((open) => !open)
  }

  const handleMarkNotificationRead = async (notificationId) => {
    await dispatch(markNotificationRead({ email: user?.email, notificationId }))
    setNotice('Notification marked as read')
  }

  const handleDeleteNotification = async (notificationId) => {
    await dispatch(deleteNotification({ email: user?.email, notificationId }))
    setNotice('Notification removed')
  }

  const [dashboardData, setDashboardData] = useState(null)
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [dashboardError, setDashboardError] = useState('')

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

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user?.email) return
      setDashboardLoading(true)
      setDashboardError('')

      try {
        const response = await api.get('/students/dashboard')

        if (!response.data?.success) {
          throw new Error(response.data?.message || 'Unable to load dashboard')
        }

        setDashboardData(response.data.data)
      } catch (error) {
        setDashboardError(error.message || 'Unable to load dashboard')
      } finally {
        setDashboardLoading(false)
      }
    }

    fetchDashboard()
  }, [user?.email])

  const handleAction = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2200)
  }

  const handleNavigate = (viewId, viewLabel) => {
    setActiveView(viewId)
    handleAction(`${viewLabel} section selected`)
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return (
          <>
            <div className="welcome-block">
              <h2>Welcome back, {firstName}!</h2>
              <p>Here&apos;s what&apos;s happening with your placements today.</p>
            </div>

            {dashboardLoading ? (
              <p className="dashboard-loading">Loading dashboard data...</p>
            ) : dashboardError ? (
              <p className="dashboard-error">{dashboardError}</p>
            ) : null}

            {notice ? <p className="dashboard-notice">{notice}</p> : null}

            <section className="stats-grid" aria-label="Placement summary">
              {[
                {
                  label: 'Applications',
                  value: dashboardData?.applicationsCount ?? '0',
                  trend: '20% this week',
                  icon: 'briefcase',
                  tone: 'purple',
                },
                {
                  label: 'Shortlisted',
                  value: dashboardData?.shortlistedCount ?? '0',
                  trend: '12% this week',
                  icon: 'check',
                  tone: 'green',
                },
                {
                  label: 'Interviews',
                  value: dashboardData?.interviewsCount ?? '0',
                  trend: '5% this week',
                  icon: 'calendar',
                  tone: 'orange',
                },
                {
                  label: 'Profile Strength',
                  value: `${dashboardData?.profileStrength ?? 0}%`,
                  trend: '',
                  icon: 'trophy',
                  tone: 'blue',
                  progress: dashboardData?.profileStrength ?? 0,
                },
              ].map((item) => (
                <article className="stat-card" key={item.label}>
                  <div className={`stat-icon ${item.tone}`}>
                    <DashboardIcon name={item.icon} />
                  </div>
                  <div className="stat-copy">
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                    {item.trend ? <small>↑ {item.trend}</small> : null}
                    {item.progress !== undefined ? (
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
                  {(dashboardData?.skills ?? []).length > 0 ? (
                    dashboardData.skills.map((skill) => (
                      <div className="skill-row" key={skill}>
                        <div>
                          <span>{skill}</span>
                          <strong>100%</strong>
                        </div>
                        <span className="skill-track">
                          <span style={{ width: '100%' }} />
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="skill-row">
                      <div>
                        <span>No skills available yet.</span>
                      </div>
                    </div>
                  )}
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
                  {(dashboardData?.recommendedOpportunities ?? []).length > 0 ? (
                    dashboardData.recommendedOpportunities.map((item) => {
                      const requiredSkills = item.requiredSkills || item.skillsRequired || []
                      const match = requiredSkills.length
                        ? Math.round(
                            (requiredSkills.filter((skill) =>
                              (dashboardData.skills || []).some(
                                (userSkill) => userSkill.toLowerCase() === skill.toLowerCase(),
                              ),
                            ).length /
                              requiredSkills.length) *
                              100,
                          )
                        : 0

                      return (
                        <button
                          className="opportunity-row"
                          key={`${item.company}-${item.title}`}
                          type="button"
                          onClick={() => handleAction(`${item.title} selected`)}
                        >
                          <span className={`company-logo ${item.company.toLowerCase()}`}>
                            {item.companyLogo ? item.companyLogo : item.company.charAt(0)}
                          </span>
                          <span className="row-copy">
                            <strong>{item.title}</strong>
                            <small>{`${item.type} · ${item.location || 'Remote'}`}</small>
                          </span>
                          <span className="match-pill">Match: {match}%</span>
                          <DashboardIcon name="chevron" />
                        </button>
                      )
                    })
                  ) : (
                    <div className="opportunity-row">
                      <span>No recommended opportunities available yet.</span>
                    </div>
                  )}
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
                  {(dashboardData?.upcomingInterviews ?? []).length > 0 ? (
                    dashboardData.upcomingInterviews.map((item) => (
                      <button
                        className="interview-row"
                        key={`${item.company}-${item.role}-${item.date}`}
                        type="button"
                        onClick={() => handleAction(`${item.company} interview selected`)}
                      >
                        <span className={`company-logo ${item.company.toLowerCase()}`}>
                          {item.company.charAt(0)}
                        </span>
                        <span className="row-copy">
                          <strong>{item.role}</strong>
                          <small>{item.round}</small>
                        </span>
                        <span className="date-copy">
                          <strong>{new Date(item.date).toLocaleDateString()}</strong>
                          <small>{item.time}</small>
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="interview-row">
                      <span>No upcoming interviews available yet.</span>
                    </div>
                  )}
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
          </>
        )
      case 'opportunities':
        return <OpportunitiesPage />
      case 'assessments':
        return <AssessmentsPage />
      case 'interviews':
        return <InterviewsPage />
      case "learning":
        return <LearningPage />;
      case 'settings':
        return <SettingsPage />
      case 'profile':
        return <StudentProfilePage/>
      default:
        return (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
              <p className="text-gray-500 mt-2">
                The page for &quot;{activeView}&quot; has not been built yet.
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="student-dashboard">
      <Sidebar
        activeView={activeView}
        onNavigate={handleNavigate}
        onLogout={() => dispatch(logout())}
      />

      <main className="dashboard-main">
        <header className="topbar">
          <h1>Student Dashboard</h1>

          <div className="topbar-actions">
            <button
              className="notification-btn"
              type="button"
              aria-label="Notifications"
              onClick={handleToggleNotifications}
              ref={notificationsButtonRef}
            >
              <DashboardIcon name="bell" />
              {unreadCount > 0 ? (
                <span className="notification-badge">{unreadCount}</span>
              ) : null}
            </button>

            <div className="user-menu-wrapper">
              <button
                className="user-menu"
                type="button"
                ref={userMenuButtonRef}
                onClick={() => setIsUserMenuOpen((open) => !open)}
              >
                <span className="avatar">{initials}</span>

                <span className="user-summary">
                  <strong>{user?.name || "Student User"}</strong>
                  <small>
                    {[user?.year, user?.branch].filter(Boolean).join(", ") || "Student"}
                  </small>
                </span>

                <DashboardIcon name="chevron" />
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView("profile")
                      setIsUserMenuOpen(false)
                    }}
                  >
                    Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      dispatch(logout())
                      setIsUserMenuOpen(false)
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {isNotificationsOpen && (
              <div
                className="notification-panel"
                ref={notificationPanelRef}
                role="dialog"
                aria-label="Notifications"
              >
                <div className="notification-panel-header">
                  <strong>Notifications</strong>

                  <button
                    type="button"
                    className="notification-close-btn"
                    onClick={() => setIsNotificationsOpen(false)}
                  >
                    Close
                  </button>
                </div>

                {notificationsStatus === "loading" ? (
                  <p className="notification-state">Loading notifications...</p>
                ) : notificationsError ? (
                  <p className="notification-error">{notificationsError}</p>
                ) : notifications.length === 0 ? (
                  <p className="notification-empty">No notifications yet.</p>
                ) : (
                  <div className="notification-list">
                    {notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`notification-row ${notification.isRead ? "" : "unread"
                          }`}
                      >
                        <div className="notification-copy">
                          <strong>{notification.title}</strong>
                          <p>{notification.message}</p>
                          <small>
                            {new Date(notification.createdAt).toLocaleString()}
                          </small>
                        </div>

                        <div className="notification-actions">
                          {!notification.isRead && (
                            <button
                              type="button"
                              className="notification-action-btn"
                              onClick={(event) => {
                                event.stopPropagation()
                                handleMarkNotificationRead(notification._id)
                              }}
                            >
                              Mark read
                            </button>
                          )}

                          <button
                            type="button"
                            className="notification-action-btn danger"
                            onClick={(event) => {
                              event.stopPropagation()
                              handleDeleteNotification(notification._id)
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </header>
        <section className="dashboard-content">{renderActiveView()}</section>
      </main>
    </div>
  )
}
