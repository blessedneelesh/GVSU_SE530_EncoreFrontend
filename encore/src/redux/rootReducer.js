import { combineReducers } from 'redux';
import concertsReducer from './concerts/concerts.reducer';
import authReducer from './auth/auth.reducer';

export const rootReducer = combineReducers({ concerts: concertsReducer, auth: authReducer });
