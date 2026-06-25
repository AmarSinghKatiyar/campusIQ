import { authStart, authSuccess, authFailure, registerUser } from './authSlice'

const simulateNetworkDelay = () => new Promise((resolve) => setTimeout(resolve, 500))

export const loginStudent = ({ email, password }) => async (dispatch, getState) => {
  dispatch(authStart())

  try {
    await simulateNetworkDelay()

    const normalizedEmail = email?.trim().toLowerCase()

    if (!normalizedEmail || !password) {
      throw new Error('Email and password are required.')
    }

    const { registeredUsers } = getState().auth
    const existingStudent = registeredUsers.find((user) => user.email === normalizedEmail)

    if (!existingStudent) {
      throw new Error('No account found with this email. Please sign up first.')
    }

    if (existingStudent.password !== password) {
      throw new Error('Incorrect password. Please try again.')
    }

    const student = {
      id: existingStudent.id,
      name: existingStudent.name,
      email: existingStudent.email,
      role: existingStudent.role,
      rollNumber: existingStudent.rollNumber,
      branch: existingStudent.branch,
      year: existingStudent.year,
    }

    dispatch(authSuccess(student))
  } catch (error) {
    dispatch(authFailure(error.message || 'Login failed'))
  }
}

export const signupStudent = ({
  name,
  rollNumber,
  email,
  branch,
  year,
  password,
  confirmPassword,
}) => async (dispatch, getState) => {
  dispatch(authStart())

  try {
    await simulateNetworkDelay()

    const normalizedEmail = email?.trim().toLowerCase()
    const trimmedName = name?.trim()
    const trimmedRollNumber = rollNumber?.trim()
    const trimmedBranch = branch?.trim()
    const trimmedYear = year?.trim()

    if (
      !trimmedName ||
      !trimmedRollNumber ||
      !normalizedEmail ||
      !trimmedBranch ||
      !trimmedYear ||
      !password ||
      !confirmPassword
    ) {
      throw new Error('All fields are required.')
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long.')
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match.')
    }

    const { registeredUsers } = getState().auth
    const emailTaken = registeredUsers.some((user) => user.email === normalizedEmail)

    if (emailTaken) {
      throw new Error('This email is already registered. Please sign in instead.')
    }

    const newStudent = {
      id: `student-${Date.now()}`,
      name: trimmedName,
      rollNumber: trimmedRollNumber,
      email: normalizedEmail,
      branch: trimmedBranch,
      year: trimmedYear,
      password,
      role: 'student',
    }

    dispatch(registerUser(newStudent))
    dispatch(authSuccess({
      id: newStudent.id,
      name: newStudent.name,
      email: newStudent.email,
      role: newStudent.role,
      rollNumber: newStudent.rollNumber,
      branch: newStudent.branch,
      year: newStudent.year,
    }))
  } catch (error) {
    dispatch(authFailure(error.message || 'Signup failed'))
  }
}
