import { createSelector } from 'reselect';

const selectConcertState = (state) => state.concerts;

export const selectConcerts = createSelector(selectConcertState, (state) => state.items);
export const selectSelectedConcert = createSelector(selectConcertState, (state) => state.selected);
export const selectConcertSearch = createSelector(selectConcertState, (state) => state.search);
export const selectConcertListStatus = createSelector(selectConcertState, (state) => state.listStatus);
export const selectConcertDetailStatus = createSelector(selectConcertState, (state) => state.detailStatus);
export const selectConcertListError = createSelector(selectConcertState, (state) => state.listError);
export const selectConcertDetailError = createSelector(selectConcertState, (state) => state.detailError);

export const selectFilteredConcerts = createSelector(
  [selectConcerts, selectConcertSearch],
  (concerts, search) => {
    const query = search.trim().toLowerCase();
    if (!query) return concerts;
    return concerts.filter((concert) => (
      `${concert.title} ${concert.category} ${concert.location}`.toLowerCase().includes(query)
    ));
  },
);
