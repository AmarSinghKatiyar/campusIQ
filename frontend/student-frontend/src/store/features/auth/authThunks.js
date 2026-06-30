import { authStart, authSuccess, authFailure } from './authSlice'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getAuthErrorMessage = (error, fallback) => (
  error.message === 'Failed to fetch'
    ? 'Unable to connect to the server. Please check if the backend is running.'
    : error.message || fallback
)

export const loginStudent = ({ email, password }) => async (dispatch) => {
  dispatch(authStart())

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Login failed')
    }

    const student = data.data

    dispatch(
      authSuccess({
        id: student._id,
        name: student.name,
        email: student.email,
        role: 'student',
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
      })
    )
  } catch (error) {
    dispatch(authFailure(getAuthErrorMessage(error, 'Login failed')))
  }
}

export const signupStudent = ({
  name,
  rollNumber,
  email,
  branch,
  graduationYear,
  cgpa,
  password,
  confirmPassword,
}) => async (dispatch) => {
  dispatch(authStart())

  try {
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match.')
    }

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        rollNumber: rollNumber.trim(),
        branch: branch.trim(),
        graduationYear: Number(graduationYear),
        cgpa: Number(cgpa),
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Signup failed')
    }

    const student = data.data

    dispatch(
      authSuccess({
        id: student._id,
        name: student.name,
        email: student.email,
        role: 'student',
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
      })
    )
  } catch (error) {
    dispatch(authFailure(getAuthErrorMessage(error, 'Signup failed')))
  }
}
