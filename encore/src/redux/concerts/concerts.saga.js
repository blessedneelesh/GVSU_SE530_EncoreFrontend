import { call, put, takeLatest } from 'redux-saga/effects';
import { CONCERT_ACTIONS } from './concerts.constants';
import { concertsApi } from '../../services/concerts/concerts.api';
import { getConcertErrorMessage } from '../../services/concerts/concerts.errors';
import { mapConcert, mapConcertCollection, mapLocationWeather } from '../../services/concerts/concerts.mappers';

function* loadConcertsWorker(action) {
  try {
    const response = yield call(concertsApi.getConcerts, action.payload);
    yield put({ type: CONCERT_ACTIONS.LOAD_SUCCESS, payload: mapConcertCollection(response) });
  } catch (error) {
    yield put({ type: CONCERT_ACTIONS.LOAD_FAILURE, payload: getConcertErrorMessage(error) });
  }
}

function* loadConcertWorker(action) {
  try {
    const response = yield call(concertsApi.getConcert, action.payload);
    yield put({ type: CONCERT_ACTIONS.LOAD_ONE_SUCCESS, payload: mapConcert(response) });
  } catch (error) {
    yield put({ type: CONCERT_ACTIONS.LOAD_ONE_FAILURE, payload: getConcertErrorMessage(error) });
  }
}

function* reserveConcertWorker(action) {
  try {
    const { concertId, reservation } = action.payload;
    const response = yield call(concertsApi.reserveConcert, concertId, reservation);
    yield put({ type: CONCERT_ACTIONS.RESERVE_SUCCESS, payload: response });
    // Refresh concert details and attendees list after reserving
    yield put({ type: CONCERT_ACTIONS.LOAD_ONE, payload: concertId });
    yield put({ type: CONCERT_ACTIONS.LOAD_ATTENDEES, payload: concertId });
  } catch (error) {
    yield put({ type: CONCERT_ACTIONS.RESERVE_FAILURE, payload: getConcertErrorMessage(error) });
  }
}

function* createConcertWorker(action) {
  try {
    const response = yield call(concertsApi.createConcert, action.payload);
    yield put({ type: CONCERT_ACTIONS.CREATE_SUCCESS, payload: mapConcert(response) });
  } catch (error) {
    yield put({ type: CONCERT_ACTIONS.CREATE_FAILURE, payload: getConcertErrorMessage(error) });
  }
}

function* createCommentWorker(action) {
  try {
    const { concertId, comment } = action.payload;
    const response = yield call(concertsApi.createComment, concertId, comment);
    const createdComment = response?.comment ?? response?.data?.comment ?? response;
    yield put({ type: CONCERT_ACTIONS.COMMENT_SUCCESS, payload: { concertId, comment: createdComment } });
  } catch (error) {
    yield put({ type: CONCERT_ACTIONS.COMMENT_FAILURE, payload: getConcertErrorMessage(error) });
  }
}

function* loadCommentsWorker(action) {
  try {
    const response = yield call(concertsApi.getConcertComments, action.payload);
    yield put({
      type: CONCERT_ACTIONS.LOAD_COMMENTS_SUCCESS,
      payload: { concertId: action.payload, comments: Array.isArray(response) ? response : [] },
    });
  } catch (error) {
    yield put({ type: CONCERT_ACTIONS.LOAD_COMMENTS_FAILURE, payload: getConcertErrorMessage(error) });
  }
}

function* loadReservationsWorker() {
  try {
    const response = yield call(concertsApi.getMyReservations);
    const items = Array.isArray(response) ? response : response?.items ?? response?.reservations ?? response?.data ?? [];
    const reservations = Array.isArray(items) ? items.map((reservation) => {
      const concert = reservation.concert ?? reservation.show ?? reservation;
      return {
        ...reservation,
        concertId: String(reservation.concert_id ?? concert.id ?? ''),
        title: concert.title ?? concert.name ?? 'Reserved show',
        date: concert.date,
        time: concert.time,
        venue: concert.venue,
        location: concert.location ?? [concert.venue, concert.city, concert.state].filter(Boolean).join(', '),
        genre: concert.genre ?? concert.category ?? 'Live music',
        imageUrl: concert.image_url ?? concert.imageUrl ?? '',
        seats: reservation.seats ?? reservation.quantity ?? 0,
        capacity: concert.capacity ?? reservation.capacity ?? null,
        reservedCount: concert.reserved_count ?? concert.reservedCount ?? reservation.reserved_count ?? null,
        cancelled: Boolean(concert.cancelled ?? reservation.cancelled),
      };
    }) : [];
    yield put({ type: CONCERT_ACTIONS.LOAD_RESERVATIONS_SUCCESS, payload: reservations });
  } catch (error) {
    yield put({ type: CONCERT_ACTIONS.LOAD_RESERVATIONS_FAILURE, payload: getConcertErrorMessage(error) });
  }
}

function* loadAttendeesWorker(action) {
  try {
    const response = yield call(concertsApi.getConcertAttendees, action.payload);
    const items = Array.isArray(response) ? response : response?.attendees ?? response?.items ?? response?.data ?? [];
    const attendees = Array.isArray(items) ? items.map((attendee) => ({
      ...attendee,
      id: attendee.id ?? attendee.user_id ?? attendee.userId,
      name: attendee.username
        ?? attendee.user_name
        ?? attendee.userName
        ?? attendee.name
        ?? attendee.user?.name
        ?? attendee.user?.username
        ?? 'Encore guest',
      seats: attendee.seats ?? attendee.quantity ?? attendee.seat_count ?? 0,
    })) : [];
    yield put({ type: CONCERT_ACTIONS.LOAD_ATTENDEES_SUCCESS, payload: { concertId: action.payload, attendees } });
  } catch (error) {
    yield put({ type: CONCERT_ACTIONS.LOAD_ATTENDEES_FAILURE, payload: getConcertErrorMessage(error) });
  }
}

function* loadLocationWeatherWorker(action) {
  try {
    const response = yield call(concertsApi.getConcertLocationWeather, action.payload);
    yield put({
      type: CONCERT_ACTIONS.LOAD_LOCATION_WEATHER_SUCCESS,
      payload: mapLocationWeather(response),
    });
  } catch (error) {
    yield put({
      type: CONCERT_ACTIONS.LOAD_LOCATION_WEATHER_FAILURE,
      payload: getConcertErrorMessage(error),
    });
  }
}

export default function* concertsSaga() {
  yield takeLatest(CONCERT_ACTIONS.LOAD, loadConcertsWorker);
  yield takeLatest(CONCERT_ACTIONS.LOAD_ONE, loadConcertWorker);
  yield takeLatest(CONCERT_ACTIONS.RESERVE, reserveConcertWorker);
  yield takeLatest(CONCERT_ACTIONS.CREATE, createConcertWorker);
  yield takeLatest(CONCERT_ACTIONS.COMMENT, createCommentWorker);
  yield takeLatest(CONCERT_ACTIONS.LOAD_COMMENTS, loadCommentsWorker);
  yield takeLatest(CONCERT_ACTIONS.LOAD_RESERVATIONS, loadReservationsWorker);
  yield takeLatest(CONCERT_ACTIONS.LOAD_ATTENDEES, loadAttendeesWorker);
  yield takeLatest(CONCERT_ACTIONS.LOAD_LOCATION_WEATHER, loadLocationWeatherWorker);
}