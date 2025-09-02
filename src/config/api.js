// src/config/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
const FRONTEND_BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Hospital endpoints (using local API routes for better error handling)
  HOSPITALS: `${FRONTEND_BASE_URL}/api/hospitals`,
  HOSPITAL_DETAIL: (hospitalId) => `${FRONTEND_BASE_URL}/api/hospitals/${hospitalId}`,
  NEAREST_HOSPITALS: `${FRONTEND_BASE_URL}/api/hospitals/nearest`,
  
  // Doctor endpoints (using local API routes for better error handling)
  DOCTORS: `${FRONTEND_BASE_URL}/api/doctors`,
  DOCTOR_DETAIL: (doctorId) => `${FRONTEND_BASE_URL}/api/doctors/${doctorId}`,
  HOSPITAL_DOCTORS: (hospitalId) => `${FRONTEND_BASE_URL}/api/hospitals/${hospitalId}/doctors`,
  
  // Direct backend endpoints for authentication (keeping these direct)
  USER_LOGIN: `${API_BASE_URL}/accounts/login/user/`,
  DRIVER_LOGIN: `${API_BASE_URL}/accounts/login/driver/`,
  USER_REGISTER: `${API_BASE_URL}/accounts/register/user/`,
  DRIVER_REGISTER: `${API_BASE_URL}/accounts/register/driver/`,
};

export const SPECIALIZATIONS = [
  { value: 'emergency', label: 'Emergency Medicine' },
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'general', label: 'General Medicine' },
  { value: 'surgery', label: 'Surgery' },
  { value: 'other', label: 'Other' },
];

export default API_BASE_URL;
