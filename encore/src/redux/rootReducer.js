import { combineReducers } from 'redux';
import concertsReducer from './concerts/concerts.reducer';

export const rootReducer = combineReducers({ concerts: concertsReducer });
