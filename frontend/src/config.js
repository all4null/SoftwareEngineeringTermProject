// API Base URL configuration
// This falls back to localhost if the environment variable is not set
<<<<<<< HEAD
export const API_BASE_URL = 'https://abcd-1234.ngrok-free.app';
=======
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Python 서버 주소 (5000번 포트)
export const PYTHON_SERVER_URL = process.env.REACT_APP_PYTHON_SERVER_URL || 'http://localhost:5000';
>>>>>>> 053a1888b0e3ab2e55cf4921e79c71d52f0756de
