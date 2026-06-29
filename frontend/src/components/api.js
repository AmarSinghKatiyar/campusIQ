import axios from 'axios';

/**
 * Create a configured axios instance.
 * This instance will be used for all API requests to the backend.
 */
const api = axios.create({
  // Use the environment variable for the backend URL, with a fallback for development
  baseURL: process.env.VITE_API_URL || 'http://localhost:5000/api',
  // Ensure that cookies are sent with every request
  withCredentials: true,
});

export default api;