const STORAGE_KEY = 'token';
const ADMIN_KEY = 'campusiq_admin';

export const authService = {
  setToken: (token) => {
    localStorage.setItem(STORAGE_KEY, token);
  },

  getToken: () => {
    return localStorage.getItem(STORAGE_KEY);
  },

  removeToken: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  setAdmin: (admin) => {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
  },

  getAdmin: () => {
    const admin = localStorage.getItem(ADMIN_KEY);
    return admin ? JSON.parse(admin) : null;
  },

  removeAdmin: () => {
    localStorage.removeItem(ADMIN_KEY);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEY);
  },

  logout: () => {
    authService.removeToken();
    authService.removeAdmin();
  },
};

export default authService;
