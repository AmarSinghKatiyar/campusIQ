import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../store/features/auth/authSlice'
import './StudentProfilePage.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const emptyProfile = {
  name: '',
  email: '',
  phoneNumber: '',
  rollNumber: '',
  branch: '',
  graduationYear: '',
  cgpa: '',
  skills: [],
  githubUrl: '',
  linkedinUrl: '',
  resumeUrl: '',
  placementStatus: '',
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
      profile.rollNumber,
      profile.branch,
      profile.graduationYear,
      profile.cgpa,
      profile.githubUrl,
      profile.linkedinUrl,
      profile.skills.length,
      profile.resumeUrl,
    ]

    return Math.round((fields.filter(Boolean).length / fields.length) * 100)
  }, [profile])

  const displayBranch = useMemo(() => {
    const branchNames = {
      CSE: 'Computer Science Engineering',
      IT: 'Information Technology',
      ECE: 'Electronics and Communication',
      EE: 'Electrical Engineering',
      ME: 'Mechanical Engineering',
      CE: 'Civil Engineering',
    }

    return branchNames[profile.branch] || profile.branch || 'Not added'
  }, [profile.branch])

  const resumeFileName = useMemo(() => {
    if (!profile.resumeUrl) return 'Resume.pdf'
    const lastSegment = profile.resumeUrl.split('/').pop()
    return decodeURIComponent(lastSegment || 'Resume.pdf')
  }, [profile.resumeUrl])

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
        dispatch(updateUser(nextProfile))
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
      dispatch(updateUser(nextProfile))
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
      const extractedCount = Object.keys(data.data?.extractedDetails || {}).length
      setProfile(nextProfile)
      dispatch(updateUser(nextProfile))
      setStatus('idle')
      setMessage(extractedCount ? `Resume uploaded and ${extractedCount} details fetched` : 'Resume uploaded. No readable details were found in this PDF.')
    } catch (error) {
      setStatus('error')
      setMessage(error.message || 'Unable to upload resume')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="profile-view">
      <div className="profile-page-top">
        <div>
          <h2>My Profile</h2>
          <p>Manage your profile and showcase your skills</p>
        </div>
        <button type="button" onClick={() => resumeInputRef.current?.click()} disabled={status === 'uploading'}>
          {status === 'uploading' ? 'Reading Resume...' : 'Upload New Resume'}
        </button>
      </div>

      <section className="profile-header">
        <div className="profile-identity-card">
          <div className="profile-avatar">
            {initials}
          </div>

          <div className="profile-intro">
            <div className="profile-name-line">
              <h2>{profile.name || 'Student User'}</h2>
              <span>{profile.placementStatus || 'Active Student'}</span>
            </div>
            <p>{[displayBranch, profile.graduationYear && `Batch ${profile.graduationYear}`].filter(Boolean).join(' / ') || 'Complete your student details to improve placement visibility.'}</p>
            <div className="profile-quick-meta">
              <span>Email: {profile.email || 'Not added'}</span>
              <span>Phone: {profile.phoneNumber || 'Not added'}</span>
              <span>CGPA: {profile.cgpa || 'Not added'}</span>
            </div>
            <div className="profile-link-row">
              {profile.githubUrl ? <a href={profile.githubUrl} target="_blank" rel="noreferrer">GitHub</a> : <span>GitHub</span>}
              {profile.linkedinUrl ? <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a> : <span>LinkedIn</span>}
              <span>Portfolio</span>
            </div>
          </div>
        </div>

        <aside className="profile-strength-card" aria-label="Profile completion">
          <div className="strength-ring" style={{ '--profile-strength': `${profileStrength}%` }}>
            <span>{profileStrength}%</span>
          </div>
          <div>
            <strong>{profileStrength >= 85 ? 'Excellent profile' : 'Profile strength'}</strong>
            <small>{profile.resumeUrl ? 'Resume is attached' : 'Upload your resume to complete this.'}</small>
          </div>
        </aside>
      </section>

      {message ? (
        <p className={status === 'error' ? 'profile-message error' : 'profile-message'}>
          {message}
        </p>
      ) : null}

      <section className="completion-card">
        <div>
          <strong>Profile Completion</strong>
          <span>Complete your profile to increase your chances of being noticed by recruiters.</span>
        </div>
        <div className="completion-track" aria-label={`${profileStrength}% completed`}>
          <span style={{ width: `${profileStrength}%` }} />
        </div>
        <strong>{profileStrength}% Completed</strong>
      </section>

      <section className="profile-layout">
        <article className="profile-panel">
          <div className="profile-panel-header">
            <h3>Personal Information</h3>
          </div>
          <div className="info-list">
            <label>
              <span>Full Name</span>
              <input value={profile.name} placeholder="Your full name" onChange={(event) => handleChange('name', event.target.value)} />
            </label>
            <label>
              <span>Email</span>
              <input type="email" value={profile.email} placeholder="name@example.com" onChange={(event) => handleChange('email', event.target.value)} />
            </label>
            <label>
              <span>Phone</span>
              <input value={profile.phoneNumber || ''} placeholder="10 digit number" onChange={(event) => handleChange('phoneNumber', event.target.value.replace(/\D/g, '').slice(0, 10))} />
            </label>
            <label>
              <span>GitHub</span>
              <input value={profile.githubUrl || ''} placeholder="https://github.com/username" onChange={(event) => handleChange('githubUrl', event.target.value)} />
            </label>
            <label>
              <span>LinkedIn</span>
              <input value={profile.linkedinUrl || ''} placeholder="https://linkedin.com/in/username" onChange={(event) => handleChange('linkedinUrl', event.target.value)} />
            </label>
          </div>
        </article>

        <article className="profile-panel">
          <div className="profile-panel-header">
            <h3>Education</h3>
          </div>
          <div className="info-list">
            <label>
              <span>Roll Number</span>
              <input value={profile.rollNumber || 'Not added'} disabled />
            </label>
            <label>
              <span>Degree</span>
              <input value="B.Tech" disabled />
            </label>
            <label>
              <span>Branch</span>
              <input value={displayBranch} disabled />
            </label>
            <label>
              <span>CGPA</span>
              <input type="number" min="0" max="10" step="0.01" value={profile.cgpa} placeholder="0.00" onChange={(event) => handleChange('cgpa', event.target.value)} />
            </label>
            <label>
              <span>Graduation Year</span>
              <input value={profile.graduationYear || 'Not added'} disabled />
            </label>
          </div>
        </article>

        <article className="profile-panel">
          <div className="profile-panel-header">
            <h3>Technical Skills</h3>
          </div>
          <textarea
            className="skills-editor"
            rows="4"
            placeholder="React, Node.js, MongoDB, Data Structures"
            value={formatSkills(profile.skills)}
            onChange={(event) => handleSkillsChange(event.target.value)}
          />
          {profile.skills.length ? (
            <div className="skill-chip-list" aria-label="Current skills">
              {profile.skills.slice(0, 20).map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          ) : (
            <p className="empty-card-copy">Upload a resume or add skills manually.</p>
          )}
        </article>

        <article className="profile-panel">
          <div className="profile-panel-header">
            <h3>Resume</h3>
          </div>
          <div className="resume-file-card">
            <span className="resume-icon" aria-hidden="true" />
            <div>
              <strong>{profile.resumeUrl ? resumeFileName : 'No resume uploaded'}</strong>
              <small>{profile.resumeUrl ? 'Uploaded resume is attached to your profile.' : 'Upload a PDF resume to fetch profile details.'}</small>
            </div>
            <div className="resume-actions">
              {profile.resumeUrl ? (
                <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
                  View
                </a>
              ) : null}
              <button type="button" onClick={() => resumeInputRef.current?.click()} disabled={status === 'uploading'}>
                {profile.resumeUrl ? 'Replace' : 'Upload'}
              </button>
            </div>
          </div>
        </article>
      </section>

      <section className="resume-card">
        <div className="resume-copy">
          <div>
            <strong>Resume parsing</strong>
            <small>Upload a PDF and CampusIQ will fetch readable profile details automatically.</small>
          </div>
        </div>
        <div className="resume-actions">
          <button type="button" onClick={() => resumeInputRef.current?.click()} disabled={status === 'uploading'}>
            {status === 'uploading' ? 'Fetching...' : 'Upload PDF'}
          </button>
        </div>
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
          {status === 'saving' ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
