// API Base URL configuration
// This falls back to localhost if the environment variable is not set
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Python 서버 주소 (5000번 포트)
export const PYTHON_SERVER_URL = process.env.REACT_APP_PYTHON_SERVER_URL || 'http://localhost:5000';
