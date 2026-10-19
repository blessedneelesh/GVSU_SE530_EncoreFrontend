import { AUTH_ACTIONS } from './auth.constants';

const storedAuth = JSON.parse(localStorage.getItem('encoreAuth') || 'null');

const initialState = {
  accessToken: storedAuth?.accessToken || storedAuth?.access_token || null,
  refreshToken: storedAuth?.refreshToken || storedAuth?.refresh_token || null,
  user: storedAuth?.user || null,
  status: storedAuth?.accessToken ? 'success' : 'idle',
  error: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN:
      return { ...state, status: 'loading', error: null };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return { ...state, ...action.payload, status: 'success', error: null };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return { ...state, status: 'error', error: action.payload };
    case AUTH_ACTIONS.LOGOUT:
      return { ...initialState };
    default:
      return state;
  }
}
