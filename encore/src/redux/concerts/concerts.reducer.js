import { CONCERT_ACTIONS } from './concerts.constants';

const initialState = {
  items: [],
  selected: null,
  listStatus: 'idle',
  detailStatus: 'idle',
  listError: null,
  detailError: null,
  search: '',
};

export default function concertsReducer(state = initialState, action) {
  switch (action.type) {
    case CONCERT_ACTIONS.LOAD:
      return { ...state, listStatus: 'loading', listError: null };
    case CONCERT_ACTIONS.LOAD_SUCCESS:
      return { ...state, items: action.payload, listStatus: 'success', listError: null };
    case CONCERT_ACTIONS.LOAD_FAILURE:
      return { ...state, listStatus: 'error', listError: action.payload };
    case CONCERT_ACTIONS.LOAD_ONE:
      return { ...state, selected: null, detailStatus: 'loading', detailError: null };
    case CONCERT_ACTIONS.LOAD_ONE_SUCCESS:
      return { ...state, selected: action.payload, detailStatus: 'success', detailError: null };
    case CONCERT_ACTIONS.LOAD_ONE_FAILURE:
      return { ...state, detailStatus: 'error', detailError: action.payload };
    case CONCERT_ACTIONS.SET_SEARCH:
      return { ...state, search: action.payload };
    default:
      return state;
  }
}
