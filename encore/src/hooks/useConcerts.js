import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loadConcerts, loadConcert, setConcertSearch } from '../redux/concerts/concerts.actions';
import {
  selectConcertDetailError,
  selectConcertDetailStatus,
  selectConcertListError,
  selectConcertListStatus,
  selectConcertSearch,
  selectFilteredConcerts,
  selectSelectedConcert,
} from '../redux/concerts/concerts.selectors';

export function useConcerts(concertId) {
  const dispatch = useAppDispatch();
  const concerts = useAppSelector(selectFilteredConcerts);
  const search = useAppSelector(selectConcertSearch);
  const listStatus = useAppSelector(selectConcertListStatus);
  const detailStatus = useAppSelector(selectConcertDetailStatus);
  const listError = useAppSelector(selectConcertListError);
  const detailError = useAppSelector(selectConcertDetailError);
  const selected = useAppSelector(selectSelectedConcert);

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
    listStatus,
    detailStatus,
    listError,
    detailError,
    setSearch: (value) => dispatch(setConcertSearch(value)),
    retry: () => dispatch(concertId ? loadConcert(concertId) : loadConcerts()),
  };
}
