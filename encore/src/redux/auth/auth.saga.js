import { call, put, takeLatest } from 'redux-saga/effects';
import { authApi } from '../../services/auth/auth.api';
import { AUTH_ACTIONS } from './auth.constants';

function getAuthErrorMessage(error) {
  return error?.response?.data?.detail
    || error?.response?.data?.message
    || error?.message
    || 'Sign in failed. Please check your credentials and try again.';
}

function* loginWorker(action) {
  try {
    const response = yield call(authApi.login, action.payload);
    const accessToken = response.access_token || response.access || response.accessToken || response.token;
    const refreshToken = response.refresh_token || response.refresh || response.refreshToken || null;

    if (!accessToken) {
      throw new Error('The login response did not include an access token.');
    }

    let user = response.user || null;
    try {
      user = yield call(authApi.getCurrentUser, accessToken);
    } catch (profileError) {
      if (!user) throw profileError;
    }
    const auth = { accessToken, refreshToken, user };
    localStorage.setItem('encoreAuth', JSON.stringify(auth));
    yield put({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: auth });
  } catch (error) {
    yield put({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: getAuthErrorMessage(error) });
  }
}

function* logoutWorker() {
  yield call([localStorage, 'removeItem'], 'encoreAuth');
}

export default function* authSaga() {
  yield takeLatest(AUTH_ACTIONS.LOGIN, loginWorker);
  yield takeLatest(AUTH_ACTIONS.LOGOUT, logoutWorker);
}
