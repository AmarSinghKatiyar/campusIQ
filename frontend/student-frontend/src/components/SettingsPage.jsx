import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../store/features/auth/authSlice'

const defaultSecurityPreferences = {
  twoStepVerification: false,
  loginAlerts: true,
  profileVisibility: 'placement-team',
}

const normalizeUser = (user) => ({
  name: user?.name || '',
  email: user?.email || '',
  phoneNumber: user?.phoneNumber || '',
  cgpa: user?.cgpa ?? '',
  githubUrl: user?.githubUrl || '',
  linkedinUrl: user?.linkedinUrl || '',
  skills: Array.isArray(user?.skills) ? user.skills.join(', ') : '',
  securityPreferences: {
    ...defaultSecurityPreferences,
    ...(user?.securityPreferences || {}),
  },
})

export default function SettingsPage() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const [form, setForm] = useState(() => normalizeUser(user))
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const initials = useMemo(() => {
    if (!form.name) return 'ST'
    return form.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('')
  }, [form.name])

  const updateField = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))
  }

  const updateSecurityPreference = (field, value) => {
    setForm((current) => ({
      ...current,
      securityPreferences: {
        ...current.securityPreferences,
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('saving')
    setMessage('')

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phoneNumber: form.phoneNumber.trim() || null,
        cgpa: form.cgpa === '' ? undefined : Number(form.cgpa),
        githubUrl: form.githubUrl.trim() || null,
        linkedinUrl: form.linkedinUrl.trim() || null,
        skills: form.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
        securityPreferences: form.securityPreferences,
      }

      const response = await fetch('http://localhost:5000/api/students/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.errors?.join(', ') || 'Unable to save settings')
      }

      const student = data.data
      const nextUser = {
        id: student._id,
        name: student.name,
        email: student.email,
        role: user?.role || 'student',
        rollNumber: student.rollNumber,
        branch: student.branch,
        graduationYear: student.graduationYear,
        year: student.graduationYear,
        cgpa: student.cgpa,
        phoneNumber: student.phoneNumber,
        githubUrl: student.githubUrl,
        linkedinUrl: student.linkedinUrl,
        skills: student.skills || [],
        securityPreferences: student.securityPreferences,
      }

      dispatch(updateUser(nextUser))
      setForm(normalizeUser(nextUser))
      setStatus('saved')
      setMessage('Settings saved successfully.')
    } catch (error) {
      setStatus('error')
      setMessage(error.message || 'Unable to save settings.')
    }
  }

  return (
    <div className="settings-page">
      <div className="settings-heading">
        <div>
          <h2>Settings</h2>
          <p>Manage your account, contact details, profile signals, and sign-in protection.</p>
        </div>
        <div className="settings-profile-chip" aria-label="Current account">
          <span className="settings-avatar">{initials}</span>
          <span>
            <strong>{form.name || 'Student User'}</strong>
            <small>{form.email || 'No email set'}</small>
          </span>
        </div>
      </div>

      {message ? (
        <p className={status === 'error' ? 'settings-message error' : 'settings-message'}>
          {message}
        </p>
      ) : null}

      <form className="settings-layout" onSubmit={handleSubmit}>
        <section className="settings-panel">
          <div className="settings-panel-header">
            <h3>Account Details</h3>
            <span>Public identity</span>
          </div>

          <div className="settings-form-grid">
            <label className="settings-field" htmlFor="settings-name">
              <span>Full name</span>
              <input
                id="settings-name"
                type="text"
                value={form.name}
                onChange={updateField('name')}
                minLength="2"
                maxLength="50"
                required
              />
            </label>

            <label className="settings-field" htmlFor="settings-email">
              <span>Email address</span>
              <input
                id="settings-email"
                type="email"
                value={form.email}
                onChange={updateField('email')}
                required
              />
            </label>

            <label className="settings-field" htmlFor="settings-phone">
              <span>Phone number</span>
              <input
                id="settings-phone"
                type="tel"
                inputMode="numeric"
                value={form.phoneNumber}
                onChange={updateField('phoneNumber')}
                placeholder="9876543210"
                pattern="[0-9]{10}"
              />
            </label>

            <label className="settings-field" htmlFor="settings-cgpa">
              <span>CGPA</span>
              <input
                id="settings-cgpa"
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={form.cgpa}
                onChange={updateField('cgpa')}
              />
            </label>
          </div>
        </section>

        <section className="settings-panel">
          <div className="settings-panel-header">
            <h3>Profile Links</h3>
            <span>Placement profile</span>
          </div>

          <div className="settings-form-grid">
            <label className="settings-field" htmlFor="settings-github">
              <span>GitHub URL</span>
              <input
                id="settings-github"
                type="url"
                value={form.githubUrl}
                onChange={updateField('githubUrl')}
                placeholder="https://github.com/username"
              />
            </label>

            <label className="settings-field" htmlFor="settings-linkedin">
              <span>LinkedIn URL</span>
              <input
                id="settings-linkedin"
                type="url"
                value={form.linkedinUrl}
                onChange={updateField('linkedinUrl')}
                placeholder="https://linkedin.com/in/username"
              />
            </label>

            <label className="settings-field wide" htmlFor="settings-skills">
              <span>Skills</span>
              <textarea
                id="settings-skills"
                rows="3"
                value={form.skills}
                onChange={updateField('skills')}
                placeholder="React, Node.js, SQL"
              />
            </label>
          </div>
        </section>

        <section className="settings-panel settings-security-panel">
          <div className="settings-panel-header">
            <h3>Security</h3>
            <span>Sign-in controls</span>
          </div>

          <div className="settings-toggle-list">
            <label className="settings-toggle">
              <span>
                <strong>2-step verification</strong>
                <small>Ask for an extra verification step during sign in.</small>
              </span>
              <input
                type="checkbox"
                checked={form.securityPreferences.twoStepVerification}
                onChange={(event) => updateSecurityPreference('twoStepVerification', event.target.checked)}
              />
            </label>

            <label className="settings-toggle">
              <span>
                <strong>Login alerts</strong>
                <small>Notify you when a new sign-in is detected.</small>
              </span>
              <input
                type="checkbox"
                checked={form.securityPreferences.loginAlerts}
                onChange={(event) => updateSecurityPreference('loginAlerts', event.target.checked)}
              />
            </label>
          </div>

          <label className="settings-field" htmlFor="settings-visibility">
            <span>Profile visibility</span>
            <select
              id="settings-visibility"
              value={form.securityPreferences.profileVisibility}
              onChange={(event) => updateSecurityPreference('profileVisibility', event.target.value)}
            >
              <option value="placement-team">Placement team only</option>
              <option value="recruiters">Verified recruiters</option>
              <option value="private">Private</option>
            </select>
          </label>
        </section>

        <div className="settings-actions">
          <button
            type="button"
            className="settings-secondary-btn"
            onClick={() => {
              setForm(normalizeUser(user))
              setMessage('')
              setStatus('idle')
            }}
          >
            Reset
          </button>
          <button type="submit" className="settings-primary-btn" disabled={status === 'saving'}>
            {status === 'saving' ? 'Saving...' : 'Save settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
