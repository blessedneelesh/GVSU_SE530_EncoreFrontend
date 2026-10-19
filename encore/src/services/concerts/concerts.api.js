import { apiClient } from '../api/apiClient';
import { API_ENDPOINTS } from '../api/apiConstants';

export const concertsApi = {
  getConcerts: (params = {}) => apiClient.get(API_ENDPOINTS.concerts, { params }).then(({ data }) => data),
  getConcert: (concertId) => apiClient.get(API_ENDPOINTS.concert(concertId)).then(({ data }) => data),
  createConcert: (concert) => apiClient.post(API_ENDPOINTS.concerts, concert).then(({ data }) => data),
  reserveConcert: (concertId, reservation) => apiClient.post(API_ENDPOINTS.reservations(concertId), reservation).then(({ data }) => data),
  getConcertComments: (concertId) => apiClient.get(API_ENDPOINTS.comments(concertId)).then(({ data }) => data),
  createComment: (concertId, text) => apiClient.post(API_ENDPOINTS.comments(concertId), { text }).then(({ data }) => data),
  getConcertAttendees: (concertId) => apiClient.get(API_ENDPOINTS.attendees(concertId)).then(({ data }) => data),
  getMyReservations: () => apiClient.get('../users/me/reservations').then(({ data }) => data),
};
