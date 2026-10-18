import { apiClient } from '../api/apiClient';
import { API_ENDPOINTS } from '../api/apiConstants';

export const concertsApi = {
  getConcerts: (params = {}) => apiClient.get(API_ENDPOINTS.concerts, { params }).then(({ data }) => data),
  getConcert: (concertId) => apiClient.get(API_ENDPOINTS.concert(concertId)).then(({ data }) => data),
};
