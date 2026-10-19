import { CONCERT_ACTIONS } from './concerts.constants';

const initialState = {
  items: [],
  selected: null,
  listStatus: 'idle',
  detailStatus: 'idle',
  listError: null,
  detailError: null,
  reservationStatus: 'idle',
  reservationError: null,
  reservation: null,
  createStatus: 'idle',
  createError: null,
  createdConcert: null,
  commentStatus: 'idle',
  commentError: null,
  comments: [],
  commentsByConcertId: {},
  commentsStatus: 'idle',
  commentsError: null,
  reservations: [],
  reservationsStatus: 'idle',
  reservationsError: null,
  attendees: [],
  attendeesStatus: 'idle',
  attendeesError: null,
  search: '',
  genre: 'All',
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
      return {
        ...state,
        selected: {
          ...action.payload,
          comments: state.commentsByConcertId[action.payload.id] ?? action.payload.comments ?? [],
        },
        detailStatus: 'success',
        detailError: null,
      };
    case CONCERT_ACTIONS.LOAD_ONE_FAILURE:
      return { ...state, detailStatus: 'error', detailError: action.payload };
    case CONCERT_ACTIONS.RESERVE:
      return { ...state, reservationStatus: 'loading', reservationError: null };
    case CONCERT_ACTIONS.RESERVE_SUCCESS:
      return { ...state, reservationStatus: 'success', reservationError: null, reservation: action.payload };
    case CONCERT_ACTIONS.RESERVE_FAILURE:
      return { ...state, reservationStatus: 'error', reservationError: action.payload };
    case CONCERT_ACTIONS.RESET_RESERVATION:
      return { ...state, reservationStatus: 'idle', reservationError: null, reservation: null };
    case CONCERT_ACTIONS.CREATE:
      return { ...state, createStatus: 'loading', createError: null, createdConcert: null };
    case CONCERT_ACTIONS.CREATE_SUCCESS:
      return { ...state, createStatus: 'success', createError: null, createdConcert: action.payload, items: [...state.items, action.payload] };
    case CONCERT_ACTIONS.CREATE_FAILURE:
      return { ...state, createStatus: 'error', createError: action.payload };
    case CONCERT_ACTIONS.COMMENT:
      return { ...state, commentStatus: 'loading', commentError: null };
    case CONCERT_ACTIONS.COMMENT_SUCCESS:
      return {
        ...state,
        commentStatus: 'success',
        commentError: null,
        comments: [...state.comments, action.payload],
        commentsByConcertId: {
          ...state.commentsByConcertId,
          [action.payload.concertId]: [
            ...(state.commentsByConcertId[action.payload.concertId] ?? []),
            action.payload.comment,
          ],
        },
        selected: state.selected && String(state.selected.id) === String(action.payload.concertId)
          ? { ...state.selected, comments: [...(state.selected.comments ?? []), action.payload.comment] }
          : state.selected,
      };
    case CONCERT_ACTIONS.COMMENT_FAILURE:
      return { ...state, commentStatus: 'error', commentError: action.payload };
    case CONCERT_ACTIONS.LOAD_COMMENTS:
      return { ...state, commentsStatus: 'loading', commentsError: null };
    case CONCERT_ACTIONS.LOAD_COMMENTS_SUCCESS:
      return {
        ...state,
        commentsStatus: 'success',
        commentsError: null,
        commentsByConcertId: {
          ...state.commentsByConcertId,
          [action.payload.concertId]: action.payload.comments,
        },
        selected: state.selected && String(state.selected.id) === String(action.payload.concertId)
          ? { ...state.selected, comments: action.payload.comments }
          : state.selected,
      };
    case CONCERT_ACTIONS.LOAD_COMMENTS_FAILURE:
      return { ...state, commentsStatus: 'error', commentsError: action.payload };
    case CONCERT_ACTIONS.LOAD_RESERVATIONS:
      return { ...state, reservationsStatus: 'loading', reservationsError: null };
    case CONCERT_ACTIONS.LOAD_RESERVATIONS_SUCCESS:
      return { ...state, reservationsStatus: 'success', reservationsError: null, reservations: action.payload };
    case CONCERT_ACTIONS.LOAD_RESERVATIONS_FAILURE:
      return { ...state, reservationsStatus: 'error', reservationsError: action.payload };
    case CONCERT_ACTIONS.LOAD_ATTENDEES:
      return { ...state, attendees: [], attendeesStatus: 'loading', attendeesError: null };
    case CONCERT_ACTIONS.LOAD_ATTENDEES_SUCCESS:
      return { ...state, attendees: action.payload.attendees, attendeesStatus: 'success', attendeesError: null };
    case CONCERT_ACTIONS.LOAD_ATTENDEES_FAILURE:
      return { ...state, attendees: [], attendeesStatus: 'error', attendeesError: action.payload };
    case CONCERT_ACTIONS.SET_SEARCH:
      return { ...state, search: action.payload };
    case CONCERT_ACTIONS.SET_GENRE:
      return { ...state, genre: action.payload };
    default:
      return state;
  }
}
