import { CONCERT_ACTIONS } from './concerts.constants';

export const loadConcerts = (params = {}) => ({ type: CONCERT_ACTIONS.LOAD, payload: params });
export const loadConcert = (concertId) => ({ type: CONCERT_ACTIONS.LOAD_ONE, payload: concertId });
export const setConcertSearch = (query) => ({ type: CONCERT_ACTIONS.SET_SEARCH, payload: query });
export const setConcertGenre = (genre) => ({ type: CONCERT_ACTIONS.SET_GENRE, payload: genre });
export const reserveConcert = (concertId, reservation) => ({
  type: CONCERT_ACTIONS.RESERVE,
  payload: { concertId, reservation },
});
export const resetReservation = () => ({ type: CONCERT_ACTIONS.RESET_RESERVATION });
export const createConcert = (concert) => ({ type: CONCERT_ACTIONS.CREATE, payload: concert });
export const createComment = (concertId, comment) => ({
  type: CONCERT_ACTIONS.COMMENT,
  payload: { concertId, comment },
});
export const loadConcertComments = (concertId) => ({ type: CONCERT_ACTIONS.LOAD_COMMENTS, payload: concertId });
export const loadMyReservations = () => ({ type: CONCERT_ACTIONS.LOAD_RESERVATIONS });
