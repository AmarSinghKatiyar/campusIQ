import { configureStore } from '@reduxjs/toolkit'
import authReducer from './store/features/auth/authSlice'
import notificationsReducer from './store/features/notifications/notificationsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationsReducer,
  },
})
