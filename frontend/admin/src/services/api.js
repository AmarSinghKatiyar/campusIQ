import API_BASE_URL from './config';

const getAuthToken = () => localStorage.getItem('token');

const makeRequest = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.log("api errror",error)
    console.error('API Error:', error);
    throw error;
  }
};

export const authAPI = {
  register: (formData) =>
    makeRequest('/admins/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    }),

  login: (email, password) =>
    makeRequest('/admins/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getAdmins: () =>
    makeRequest('/admins', { method: 'GET' }),
};

export const dashboardAPI = {
  getStats: () =>
    makeRequest('/dashboard/stats', { method: 'GET' }),

  getTopStudents: () =>
    makeRequest('/dashboard/top-students', { method: 'GET' }),

  getAllStudents: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return makeRequest(`/dashboard/students${params ? '?' + params : ''}`, {
      method: 'GET',
    });
  },

  getBranchDistribution: () =>
    makeRequest('/dashboard/branch-distribution', { method: 'GET' }),

  getRecentActivities: () =>
    makeRequest('/dashboard/recent-activities', { method: 'GET' }),

  getPerformanceData: () =>
    makeRequest('/dashboard/performance', { method: 'GET' }),

  getPlacementDrives: () =>
    makeRequest('/dashboard/placement-drives', { method: 'GET' }),
};

export const studentAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return makeRequest(`/students${params ? '?' + params : ''}`, {
      method: 'GET',
    });
  },

  getById: (id) =>
    makeRequest(`/students/${id}`, { method: 'GET' }),

  create: (studentData) =>
    makeRequest('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    }),

  update: (id, studentData) =>
    makeRequest(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    }),

  delete: (id) =>
    makeRequest(`/students/${id}`, { method: 'DELETE' }),
};

export default makeRequest;
