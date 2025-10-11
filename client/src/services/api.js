import axios from 'axios';
import { auth } from '../utils/firebase';

// Create a new Axios instance with a base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add a request interceptor to automatically attach the Firebase ID token
API.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  
  if (user) {
    try {
      const token = await user.getIdToken();
      // Add the token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Error getting auth token:", error);
      // Optionally, handle token refresh errors or log the user out
    }
  }
  
  return config;
}, (error) => {
  // Handle request errors
  return Promise.reject(error);
});

export default API;