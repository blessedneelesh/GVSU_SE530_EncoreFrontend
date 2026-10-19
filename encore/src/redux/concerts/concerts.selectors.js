import { createSelector } from 'reselect';

const selectConcertState = (state) => state.concerts;

export const selectConcerts = createSelector(selectConcertState, (state) => state.items);
export const selectSelectedConcert = createSelector(selectConcertState, (state) => state.selected);
export const selectConcertSearch = createSelector(selectConcertState, (state) => state.search);
export const selectConcertGenre = createSelector(selectConcertState, (state) => state.genre);
export const selectConcertListStatus = createSelector(selectConcertState, (state) => state.listStatus);
export const selectConcertDetailStatus = createSelector(selectConcertState, (state) => state.detailStatus);
export const selectConcertListError = createSelector(selectConcertState, (state) => state.listError);
export const selectConcertDetailError = createSelector(selectConcertState, (state) => state.detailError);
export const selectReservationStatus = createSelector(selectConcertState, (state) => state.reservationStatus);
export const selectReservationError = createSelector(selectConcertState, (state) => state.reservationError);
export const selectReservation = createSelector(selectConcertState, (state) => state.reservation);
export const selectCreateStatus = createSelector(selectConcertState, (state) => state.createStatus);
export const selectCreateError = createSelector(selectConcertState, (state) => state.createError);
export const selectCreatedConcert = createSelector(selectConcertState, (state) => state.createdConcert);
export const selectCommentStatus = createSelector(selectConcertState, (state) => state.commentStatus);
export const selectCommentError = createSelector(selectConcertState, (state) => state.commentError);
export const selectCommentsStatus = createSelector(selectConcertState, (state) => state.commentsStatus);
export const selectCommentsError = createSelector(selectConcertState, (state) => state.commentsError);
export const selectReservations = createSelector(selectConcertState, (state) => state.reservations);
export const selectReservationsStatus = createSelector(selectConcertState, (state) => state.reservationsStatus);
export const selectReservationsError = createSelector(selectConcertState, (state) => state.reservationsError);
export const selectMyShows = createSelector(
  [selectConcerts, (state) => state.auth.user?.id],
  (concerts, userId) => userId ? concerts.filter((concert) => concert.ownerId === String(userId)) : [],
);

export const selectFilteredConcerts = createSelector(
  [selectConcerts, selectConcertSearch, selectConcertGenre],
  (concerts, search, genre) => {
    const query = search.trim().toLowerCase();
    if (!query && genre === 'All') return concerts;
    return concerts.filter((concert) => (
      (genre === 'All' || concert.genre === genre)
      && `${concert.title} ${concert.genre} ${concert.location}`.toLowerCase().includes(query)
    ));
  },
);
