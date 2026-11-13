import axios from 'axios';
import { API_BASE_URL } from './apiConstants';
import { authApi } from '../auth/auth.api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { Accept: 'application/json' },
});

function getStoredAuth() {
  const raw = sessionStorage.getItem('encoreAuth') || localStorage.getItem('encoreAuth');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

apiClient.interceptors.request.use((config) => {
  const storedAuth = getStoredAuth();
  const accessToken = storedAuth?.accessToken || storedAuth?.access_token || storedAuth?.token;
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
    const storedAuth = getStoredAuth();
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
      sessionStorage.setItem('encoreAuth', JSON.stringify(nextAuth));
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      sessionStorage.removeItem('encoreAuth');
      localStorage.removeItem('encoreAuth');
      return Promise.reject(refreshError);
    }
  },
);