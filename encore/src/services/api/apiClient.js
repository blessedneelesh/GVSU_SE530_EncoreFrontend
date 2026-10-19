import axios from 'axios';
import { API_BASE_URL } from './apiConstants';
import { authApi } from '../auth/auth.api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { Accept: 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const storedAuth = JSON.parse(localStorage.getItem('encoreAuth') || 'null');
  const accessToken = storedAuth?.accessToken || storedAuth?.access_token;
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const storedAuth = JSON.parse(localStorage.getItem('encoreAuth') || 'null');
    const refreshToken = storedAuth?.refreshToken || storedAuth?.refresh_token;

    if (error.response?.status !== 401 || !refreshToken || originalRequest?._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      const response = await authApi.refresh(refreshToken);
      const accessToken = response.access_token || response.access || response.accessToken;
      if (!accessToken) {
        throw new Error('The refresh response did not include an access token.');
      }

      const nextAuth = {
        ...storedAuth,
        accessToken,
        refreshToken: response.refresh_token || response.refresh || response.refreshToken || refreshToken,
      };
      localStorage.setItem('encoreAuth', JSON.stringify(nextAuth));
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem('encoreAuth');
      return Promise.reject(refreshError);
    }
  },
);
