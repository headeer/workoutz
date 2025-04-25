const isDevelopment = process.env.NODE_ENV === 'development';

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:3000' 
  : '/api';

export const ENDPOINTS = {
  workouts: `${API_BASE_URL}/workouts`,
  userProgress: `${API_BASE_URL}/userProgress`,
}; 