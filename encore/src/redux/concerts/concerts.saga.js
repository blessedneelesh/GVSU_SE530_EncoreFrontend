import { call, put, takeLatest } from 'redux-saga/effects';
import { CONCERT_ACTIONS } from './concerts.constants';
import { concertsApi } from '../../services/concerts/concerts.api';
import { getConcertErrorMessage } from '../../services/concerts/concerts.errors';
import { mapConcert, mapConcertCollection } from '../../services/concerts/concerts.mappers';

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
  } catch (error) {
    yield put({ type: CONCERT_ACTIONS.RESERVE_FAILURE, payload: getConcertErrorMessage(error) });
  }
}

export default function* concertsSaga() {
  yield takeLatest(CONCERT_ACTIONS.LOAD, loadConcertsWorker);
  yield takeLatest(CONCERT_ACTIONS.LOAD_ONE, loadConcertWorker);
  yield takeLatest(CONCERT_ACTIONS.RESERVE, reserveConcertWorker);
}
