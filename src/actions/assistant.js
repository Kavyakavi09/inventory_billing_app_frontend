import * as api from '../api/index';
import { ASSISTANT_ASK_FAIL, ASSISTANT_ASK_START, ASSISTANT_ASK_SUCCESS } from './constants';

export const sendAssistantMessage = (message) => async (dispatch) => {
  dispatch({ type: ASSISTANT_ASK_START, payload: message });

  try {
    const { data } = await api.askAssistant(message);
    dispatch({ type: ASSISTANT_ASK_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ASSISTANT_ASK_FAIL,
      payload: error.response?.data?.message || 'The assistant could not answer.',
    });
  }
};
