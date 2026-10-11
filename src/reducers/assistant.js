import {
  ASSISTANT_ASK_FAIL,
  ASSISTANT_ASK_START,
  ASSISTANT_ASK_SUCCESS,
  ASSISTANT_HISTORY,
  ASSISTANT_HISTORY_OLDER,
  ASSISTANT_HISTORY_START,
} from '../actions/constants';

const INITIAL_INDEX = 100000;

const assistant = (
  state = {
    messages: [],
    sending: false,
    error: '',
    hasMore: false,
    nextCursor: null,
    historyLoaded: false,
    loadingHistory: false,
    firstItemIndex: INITIAL_INDEX,
  },
  action
) => {
  switch (action.type) {
    case ASSISTANT_HISTORY_START:
      return { ...state, loadingHistory: true, error: '' };
    case ASSISTANT_HISTORY:
      return {
        ...state,
        loadingHistory: false,
        historyLoaded: true,
        messages: action.payload.messages,
        hasMore: action.payload.hasMore,
        nextCursor: action.payload.nextCursor,
        firstItemIndex: INITIAL_INDEX,
      };
    case ASSISTANT_HISTORY_OLDER:
      return {
        ...state,
        loadingHistory: false,
        messages: [...action.payload.messages, ...state.messages],
        hasMore: action.payload.hasMore,
        nextCursor: action.payload.nextCursor,
        firstItemIndex: state.firstItemIndex - action.payload.messages.length,
      };
    case ASSISTANT_ASK_START:
      return {
        ...state,
        sending: true,
        error: '',
        messages: [...state.messages, { role: 'user', text: action.payload }],
      };
    case ASSISTANT_ASK_SUCCESS:
      return {
        ...state,
        sending: false,
        messages: [
          ...state.messages,
          { role: 'assistant', text: action.payload.answer, cache: action.payload.cache },
        ],
      };
    case ASSISTANT_ASK_FAIL:
      return { ...state, sending: false, loadingHistory: false, error: action.payload };
    default:
      return state;
  }
};

export default assistant;
