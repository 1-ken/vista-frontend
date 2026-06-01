import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');
    
    // Clean token if it contains quotes
    if (token && token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
