import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'campusIQ-auth'

const loadPersistedState = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return {
      ...parsed,
      status: 'idle',
      error: null,
    }
  } catch {
    return null
  }
}

const savePersistedState = (state) => {
  if (typeof window === 'undefined') {
    return
  }

  const persisted = {
    registeredUsers: state.registeredUsers,
    user: state.user
      ? {
          id: state.user.id,
          name: state.user.name,
          email: state.user.email,
          role: state.user.role,
          rollNumber: state.user.rollNumber,
          branch: state.user.branch,
          year: state.user.year,
          graduationYear: state.user.graduationYear,
          cgpa: state.user.cgpa,
          phoneNumber: state.user.phoneNumber,
          githubUrl: state.user.githubUrl,
          linkedinUrl: state.user.linkedinUrl,
          skills: state.user.skills,
          securityPreferences: state.user.securityPreferences,
        }
      : null,
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
}

const defaultState = {
  user: null,
  status: 'idle',
  error: null,
  registeredUsers: [],
}

const initialState = loadPersistedState() || defaultState

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart(state) {
      state.status = 'loading'
      state.error = null
    },
    authSuccess(state, action) {
      state.status = 'succeeded'
      state.user = action.payload
      state.error = null
      savePersistedState(state)
    },
    authFailure(state, action) {
      state.status = 'failed'
      state.error = action.payload
      state.user = null
    },
    logout(state) {
      state.user = null
      state.status = 'idle'
      state.error = null
      savePersistedState(state)
    },
    clearAuthError(state) {
      state.error = null
      if (state.status === 'failed') {
        state.status = 'idle'
      }
    },
    registerUser(state, action) {
      state.registeredUsers.push(action.payload)
      savePersistedState(state)
    },
    updateUser(state, action) {
      state.user = {
        ...state.user,
        ...action.payload,
      }
      savePersistedState(state)
    },
  },
})

export const { authStart, authSuccess, authFailure, logout, clearAuthError, registerUser, updateUser } = authSlice.actions

export default authSlice.reducer
