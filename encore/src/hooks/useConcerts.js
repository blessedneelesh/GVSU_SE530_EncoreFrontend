import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { createComment, createConcert, loadConcerts, loadConcert, loadConcertComments, loadMyReservations, reserveConcert, resetReservation, setConcertGenre, setConcertSearch } from '../redux/concerts/concerts.actions';
import {
  selectConcertDetailError,
  selectConcertDetailStatus,
  selectConcertListError,
  selectConcertListStatus,
  selectConcertSearch,
  selectConcertGenre,
  selectFilteredConcerts,
  selectSelectedConcert,
  selectReservationStatus,
  selectReservationError,
  selectReservation,
  selectCreateStatus,
  selectCreateError,
  selectCreatedConcert,
  selectCommentStatus,
  selectCommentError,
  selectCommentsStatus,
  selectCommentsError,
  selectReservations,
  selectReservationsStatus,
  selectReservationsError,
} from '../redux/concerts/concerts.selectors';

export function useConcerts(concertId) {
  const dispatch = useAppDispatch();
  const loadReservations = useCallback(() => dispatch(loadMyReservations()), [dispatch]);
  const concerts = useAppSelector(selectFilteredConcerts);
  const search = useAppSelector(selectConcertSearch);
  const genre = useAppSelector(selectConcertGenre);
  const listStatus = useAppSelector(selectConcertListStatus);
  const detailStatus = useAppSelector(selectConcertDetailStatus);
  const listError = useAppSelector(selectConcertListError);
  const detailError = useAppSelector(selectConcertDetailError);
  const selected = useAppSelector(selectSelectedConcert);
  const reservationStatus = useAppSelector(selectReservationStatus);
  const reservationError = useAppSelector(selectReservationError);
  const reservation = useAppSelector(selectReservation);
  const createStatus = useAppSelector(selectCreateStatus);
  const createError = useAppSelector(selectCreateError);
  const createdConcert = useAppSelector(selectCreatedConcert);
  const commentStatus = useAppSelector(selectCommentStatus);
  const commentError = useAppSelector(selectCommentError);
  const commentsStatus = useAppSelector(selectCommentsStatus);
  const commentsError = useAppSelector(selectCommentsError);
  const reservations = useAppSelector(selectReservations);
  const reservationsStatus = useAppSelector(selectReservationsStatus);
  const reservationsError = useAppSelector(selectReservationsError);

  useEffect(() => {
    if (concertId) {
      dispatch(loadConcert(concertId));
      dispatch(loadConcertComments(concertId));
    } else {
      dispatch(loadConcerts());
    }
  }, [concertId, dispatch]);

  return {
    concerts,
    selected,
    search,
    genre,
    listStatus,
    detailStatus,
    listError,
    detailError,
    reservationStatus,
    reservationError,
    reservation,
    createStatus,
    createError,
    createdConcert,
    commentStatus,
    commentError,
    commentsStatus,
    commentsError,
    reservations,
    reservationsStatus,
    reservationsError,
    setSearch: (value) => dispatch(setConcertSearch(value)),
    setGenre: (value) => dispatch(setConcertGenre(value)),
    retry: () => dispatch(concertId ? loadConcert(concertId) : loadConcerts()),
    reserve: (reservationDetails) => dispatch(reserveConcert(concertId, reservationDetails)),
    resetReservation: () => dispatch(resetReservation()),
    create: (concert) => dispatch(createConcert(concert)),
    comment: (value) => dispatch(createComment(concertId, value)),
    loadReservations,
  };
}
