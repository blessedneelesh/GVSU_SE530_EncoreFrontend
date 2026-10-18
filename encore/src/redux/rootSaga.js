import { all, fork } from 'redux-saga/effects';
import concertsSaga from './concerts/concerts.saga';

export default function* rootSaga() {
  yield all([fork(concertsSaga)]);
}
