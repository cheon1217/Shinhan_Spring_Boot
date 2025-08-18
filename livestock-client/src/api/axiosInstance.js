import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8090', // 백엔드 포트에 맞게
  withCredentials: true, // 쿠키/인증 정보 포함!
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
