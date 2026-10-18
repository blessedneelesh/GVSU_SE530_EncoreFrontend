import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loadConcerts, loadConcert, reserveConcert, resetReservation, setConcertGenre, setConcertSearch } from '../redux/concerts/concerts.actions';
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
} from '../redux/concerts/concerts.selectors';

export function useConcerts(concertId) {
  const dispatch = useAppDispatch();
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

  useEffect(() => {
    if (concertId) {
      dispatch(loadConcert(concertId));
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
    setSearch: (value) => dispatch(setConcertSearch(value)),
    setGenre: (value) => dispatch(setConcertGenre(value)),
    retry: () => dispatch(concertId ? loadConcert(concertId) : loadConcerts()),
    reserve: (reservationDetails) => dispatch(reserveConcert(concertId, reservationDetails)),
    resetReservation: () => dispatch(resetReservation()),
  };
}
