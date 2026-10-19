import axios from 'axios';

const AUTH_BASE_URL = 'http://127.0.0.1:8000/api/v1/auth/';

const authClient = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: 10000,
  headers: { Accept: 'application/json' },
});

export const authApi = {
  login: (credentials) => authClient.post('login', credentials).then(({ data }) => data),
  refresh: (refreshToken) => authClient.post('refresh', { refresh_token: refreshToken }).then(({ data }) => data),
  getCurrentUser: (accessToken) => authClient.get('../users/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then(({ data }) => data),
};
