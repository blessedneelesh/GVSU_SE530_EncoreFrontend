import axios from 'axios';
import { API_BASE_URL } from './apiConstants';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { Accept: 'application/json' },
});
