import { all, fork } from 'redux-saga/effects';
import concertsSaga from './concerts/concerts.saga';
import authSaga from './auth/auth.saga';

export default function* rootSaga() {
  yield all([fork(concertsSaga), fork(authSaga)]);
}
