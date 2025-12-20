import axios from 'axios';
// Allow overriding the API base URL via env at build/run time (useful for Docker)
const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

// Normalize error messages so components can show friendly messages for network failures
API.interceptors.response.use(
  response => response,
  error => {
    // If there's no response, it's likely a network error (server down / CORS / DNS)
    if (!error.response) {
    error.message = 'Network Error: Unable to reach backend at http://localhost:5000. Is the backend server running?';
    return Promise.reject(error);
   }

    // Prefer a server-sent message if available
    const serverMsg = error.response.data?.message || error.response.statusText;
    if (serverMsg) error.message = serverMsg;
    return Promise.reject(error);
  }
);

export default API;

