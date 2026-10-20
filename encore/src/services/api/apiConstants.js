export const API_BASE_URL = 'http://127.0.0.1:8000/api/v1/concerts/';
export const API_ROOT_URL = 'http://127.0.0.1:8000/api/v1/';

export const API_ENDPOINTS = {
  concerts: '',
  concert: (concertId) => `${encodeURIComponent(concertId)}`,
  reservations: (concertId) => `${encodeURIComponent(concertId)}/reservations`,
  comments: (concertId) => `${encodeURIComponent(concertId)}/comments`,
  attendees: (concertId) => `${encodeURIComponent(concertId)}/attendees`,
  locationWeather: (concertId) => `${encodeURIComponent(concertId)}/location-weather`,
};