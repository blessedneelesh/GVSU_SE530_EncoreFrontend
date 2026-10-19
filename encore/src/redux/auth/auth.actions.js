import { AUTH_ACTIONS } from './auth.constants';

export const login = (credentials) => ({ type: AUTH_ACTIONS.LOGIN, payload: credentials });
export const register = (userData) => ({ type: AUTH_ACTIONS.REGISTER, payload: userData });
export const logout = () => ({ type: AUTH_ACTIONS.LOGOUT });