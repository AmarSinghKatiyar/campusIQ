import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  list: [],
  status: 'idle',
  error: null,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    fetchNotificationsStart(state) {
      state.status = 'loading'
      state.error = null
    },
    fetchNotificationsSuccess(state, action) {
      state.status = 'succeeded'
      state.list = action.payload
      state.error = null
    },
    fetchNotificationsFailure(state, action) {
      state.status = 'failed'
      state.error = action.payload
    },
    markNotificationReadSuccess(state, action) {
      const id = action.payload
      const notification = state.list.find((item) => item._id === id)
      if (notification) {
        notification.isRead = true
      }
    },
    deleteNotificationSuccess(state, action) {
      state.list = state.list.filter((item) => item._id !== action.payload)
    },
    clearNotificationError(state) {
      state.error = null
      if (state.status === 'failed') {
        state.status = 'idle'
      }
    },
  },
})

export const {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  markNotificationReadSuccess,
  deleteNotificationSuccess,
  clearNotificationError,
} = notificationsSlice.actions

export default notificationsSlice.reducer
