import axios from 'axios';

// const BASE_URL = 'https://api-inventory.isavralabel.com/api';
const BASE_URL = 'https://api-inventory.isavralabel.com/appgi/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('apgi_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public API endpoints
export const publicAPI = {
  // Get profile organisasi
  getProfile: () => api.get('/profile'),
  
  // Get visi misi
  getVisiMisi: () => api.get('/visi-misi'),
  
  // Get struktur organisasi
  getStruktur: () => api.get('/struktur'),
  
  // Get kontak
  getKontak: () => api.get('/kontak'),
  
  // Get website info
  getWebsiteInfo: () => api.get('/website-info'),
};

// Admin API endpoints
export const adminAPI = {
  // Authentication
  login: (credentials) => api.post('/admin/login', credentials),
  verifyToken: () => api.get('/admin/verify'),
  
  // Profile organisasi
  updateProfile: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    return api.put('/admin/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Visi Misi
  updateVisiMisi: (data) => api.put('/admin/visi-misi', data),
  
  // Struktur organisasi
  updateStruktur: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    return api.put('/admin/struktur', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Kontak
  updateKontak: (data) => api.put('/admin/kontak', data),
  
  // Website info
  updateWebsiteInfo: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    return api.put('/admin/website-info', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export default api;