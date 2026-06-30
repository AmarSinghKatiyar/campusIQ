import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserProfile } from '../store/features/auth/authSlice'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const emptyProfile = {
  name: '',
  email: '',
  phoneNumber: '',
  cgpa: '',
  skills: [],
  githubUrl: '',
  linkedinUrl: '',
  resumeUrl: '',
}

const normalizeProfile = (profile) => ({
  ...emptyProfile,
  ...profile,
  skills: Array.isArray(profile?.skills) ? profile.skills : [],
  cgpa: profile?.cgpa ?? '',
})

const formatSkills = (skills) => skills.join(', ')

export default function StudentProfilePage() {
  const dispatch = useDispatch()
  const authUser = useSelector((state) => state.auth.user)
  const resumeInputRef = useRef(null)
  const [profile, setProfile] = useState(() => normalizeProfile(authUser))
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const initials = useMemo(() => {
    if (!profile.name) return 'ST'
    return profile.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('')
  }, [profile.name])

  const profileStrength = useMemo(() => {
    const fields = [
      profile.name,
      profile.email,
      profile.phoneNumber,
      profile.cgpa,
      profile.githubUrl,
      profile.linkedinUrl,
      profile.skills.length,
      profile.resumeUrl,
    ]

    return Math.round((fields.filter(Boolean).length / fields.length) * 100)
  }, [profile])

  useEffect(() => {
    const fetchProfile = async () => {
      setStatus('loading')
      setMessage('')

      try {
        const response = await fetch(`${API_BASE_URL}/students/profile`, {
          credentials: 'include',
        })
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Unable to fetch profile')
        }

        const nextProfile = normalizeProfile(data.data)
        setProfile(nextProfile)
        dispatch(updateUserProfile(nextProfile))
        setStatus('idle')
      } catch (error) {
        setStatus('error')
        setMessage(error.message || 'Unable to fetch profile')
      }
    }

    fetchProfile()
  }, [dispatch])

  const handleChange = (field, value) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [field]: value,
    }))
  }

  const handleSkillsChange = (value) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      skills: value
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),
    }))
  }

  const handleSave = async () => {
    setStatus('saving')
    setMessage('')

    try {
      const payload = {
        name: profile.name,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        cgpa: profile.cgpa === '' ? '' : Number(profile.cgpa),
        skills: profile.skills,
        githubUrl: profile.githubUrl,
        linkedinUrl: profile.linkedinUrl,
      }

      const response = await fetch(`${API_BASE_URL}/students/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to update profile')
      }

      const nextProfile = normalizeProfile(data.data)
      setProfile(nextProfile)
      dispatch(updateUserProfile(nextProfile))
      setStatus('idle')
      setMessage('Profile updated successfully')
    } catch (error) {
      setStatus('error')
      setMessage(error.message || 'Unable to update profile')
    }
  }

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setStatus('error')
      setMessage('Please upload a PDF resume')
      event.target.value = ''
      return
    }

    setStatus('uploading')
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('resume', file)

      const response = await fetch(`${API_BASE_URL}/students/upload-resume`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to upload resume')
      }

      const nextProfile = normalizeProfile(data.data?.student || data.data || {
        ...profile,
        resumeUrl: data.data?.resumeUrl,
      })
      setProfile(nextProfile)
      dispatch(updateUserProfile(nextProfile))
      setStatus('idle')
      setMessage('Resume uploaded successfully')
    } catch (error) {
      setStatus('error')
      setMessage(error.message || 'Unable to upload resume')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="profile-view">
      <section className="profile-hero">
        <div className="profile-identity">
          <div className="profile-photo">
            <span>{initials}</span>
          </div>

          <div className="profile-intro">
            <div className="profile-name-line">
              <h2>{profile.name || 'Student User'}</h2>
              <span className="verified-badge">Verified</span>
            </div>
            <p>{[profile.branch, profile.graduationYear || profile.year].filter(Boolean).join(' · ') || 'Student profile'}</p>
            <div className="profile-contact-strip">
              <span>{profile.email || 'Email not added'}</span>
              <span>{profile.phoneNumber || 'Phone not added'}</span>
            </div>
          </div>
        </div>

        <aside className="profile-strength-card">
          <h3>Profile Strength</h3>
          <div className="strength-ring" style={{ '--profile-strength': `${profileStrength}%` }}>
            <span>{profileStrength}%</span>
          </div>
          <strong>{profileStrength >= 85 ? 'Excellent' : 'Keep building'}</strong>
        </aside>
      </section>

      {message ? (
        <p className={status === 'error' ? 'profile-message error' : 'profile-message'}>
          {message}
        </p>
      ) : null}

      <section className="profile-grid">
        <article className="profile-panel">
          <div className="profile-panel-header">
            <h3>Personal Information</h3>
          </div>
          <div className="profile-form-grid">
            <label>
              <span>Full Name</span>
              <input value={profile.name} onChange={(event) => handleChange('name', event.target.value)} />
            </label>
            <label>
              <span>Email</span>
              <input value={profile.email} onChange={(event) => handleChange('email', event.target.value)} />
            </label>
            <label>
              <span>Phone</span>
              <input value={profile.phoneNumber || ''} onChange={(event) => handleChange('phoneNumber', event.target.value)} />
            </label>
            <label>
              <span>CGPA</span>
              <input value={profile.cgpa} onChange={(event) => handleChange('cgpa', event.target.value)} />
            </label>
          </div>
        </article>

        <article className="profile-panel">
          <div className="profile-panel-header">
            <h3>Links and Skills</h3>
          </div>
          <div className="profile-form-grid">
            <label>
              <span>GitHub</span>
              <input value={profile.githubUrl || ''} onChange={(event) => handleChange('githubUrl', event.target.value)} />
            </label>
            <label>
              <span>LinkedIn</span>
              <input value={profile.linkedinUrl || ''} onChange={(event) => handleChange('linkedinUrl', event.target.value)} />
            </label>
            <label className="wide">
              <span>Skills</span>
              <textarea
                rows="4"
                value={formatSkills(profile.skills)}
                onChange={(event) => handleSkillsChange(event.target.value)}
              />
            </label>
          </div>
        </article>
      </section>

      <section className="resume-card">
        <div>
          <strong>{profile.resumeUrl ? 'Resume uploaded' : 'No resume uploaded yet'}</strong>
          <small>{profile.resumeUrl || 'Upload a PDF resume to attach it to your profile.'}</small>
        </div>
        <button type="button" onClick={() => resumeInputRef.current?.click()} disabled={status === 'uploading'}>
          {status === 'uploading' ? 'Uploading...' : 'Upload Resume'}
        </button>
        <input
          ref={resumeInputRef}
          className="resume-input"
          type="file"
          accept="application/pdf"
          onChange={handleResumeUpload}
        />
      </section>

      <div className="profile-actions">
        <button type="button" onClick={handleSave} disabled={status === 'saving' || status === 'loading'}>
          {status === 'saving' ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  )
}
