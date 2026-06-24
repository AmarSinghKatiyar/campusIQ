import { authStart, authSuccess, authFailure, registerUser } from './authSlice'

const simulateNetworkDelay = () => new Promise((resolve) => setTimeout(resolve, 500))

export const loginStudent = ({ email, password }) => async (dispatch, getState) => {
  dispatch(authStart())

  try {
    await simulateNetworkDelay()

    if (!email || !password) {
      throw new Error('Email and password are required.')
    }

    const { registeredUsers } = getState().auth
    const existingStudent = registeredUsers.find((user) => user.email === email)

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
    }

    dispatch(authSuccess(student))
  } catch (error) {
    dispatch(authFailure(error.message || 'Login failed'))
  }
}

export const signupStudent = ({ name, email, password, confirmPassword }) => async (dispatch, getState) => {
  dispatch(authStart())

  try {
    await simulateNetworkDelay()

    if (!name || !email || !password || !confirmPassword) {
      throw new Error('All fields are required.')
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match.')
    }

    const { registeredUsers } = getState().auth
    const emailTaken = registeredUsers.some((user) => user.email === email)

    if (emailTaken) {
      throw new Error('This email is already registered. Please sign in instead.')
    }

    const newStudent = {
      id: `student-${Date.now()}`,
      name,
      email,
      password,
      role: 'student',
    }

    dispatch(registerUser(newStudent))
    dispatch(authSuccess({
      id: newStudent.id,
      name: newStudent.name,
      email: newStudent.email,
      role: newStudent.role,
    }))
  } catch (error) {
    dispatch(authFailure(error.message || 'Signup failed'))
  }
}
