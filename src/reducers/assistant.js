import { ASSISTANT_ASK_FAIL, ASSISTANT_ASK_START, ASSISTANT_ASK_SUCCESS } from '../actions/constants';

const assistant = (state = { messages: [], sending: false, error: '' }, action) => {
  switch (action.type) {
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
      return { ...state, sending: false, error: action.payload };
    default:
      return state;
  }
};

export default assistant;
