import {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  markNotificationReadSuccess,
  deleteNotificationSuccess,
} from './notificationsSlice'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const handleResponse = async (response) => {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }
  return data
}

export const fetchNotifications = (email) => async (dispatch) => {
  dispatch(fetchNotificationsStart())

  try {
    if (!email) {
      throw new Error('Student email is required to load notifications.')
    }

    const response = await fetch(
      `${API_BASE}/notifications?email=${encodeURIComponent(email)}`,
      {
        credentials: 'include',
      }
    )
    const data = await handleResponse(response)
    dispatch(fetchNotificationsSuccess(data.data.notifications || []))
  } catch (error) {
    dispatch(fetchNotificationsFailure(error.message || 'Unable to load notifications'))
  }
}

export const markNotificationRead = ({ email, notificationId }) => async (dispatch) => {
  try {
    if (!email || !notificationId) {
      throw new Error('Email and notification ID are required')
    }

    const response = await fetch(
      `${API_BASE}/notifications/${notificationId}/read?email=${encodeURIComponent(email)}`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    await handleResponse(response)
    dispatch(markNotificationReadSuccess(notificationId))
  } catch (error) {
    dispatch(fetchNotificationsFailure(error.message || 'Unable to mark notification read'))
  }
}

export const deleteNotification = ({ email, notificationId }) => async (dispatch) => {
  try {
    if (!email || !notificationId) {
      throw new Error('Email and notification ID are required')
    }

    const response = await fetch(
      `${API_BASE}/notifications/${notificationId}?email=${encodeURIComponent(email)}`,
      {
        method: 'DELETE',
        credentials: 'include',
      },
    )

    await handleResponse(response)
    dispatch(deleteNotificationSuccess(notificationId))
  } catch (error) {
    dispatch(fetchNotificationsFailure(error.message || 'Unable to delete notification'))
  }
}
