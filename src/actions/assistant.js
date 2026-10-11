import * as api from '../api/index';
import {
  ASSISTANT_ASK_FAIL,
  ASSISTANT_ASK_START,
  ASSISTANT_ASK_SUCCESS,
  ASSISTANT_HISTORY,
  ASSISTANT_HISTORY_OLDER,
  ASSISTANT_HISTORY_START,
} from './constants';

export const loadAssistantHistory = () => async (dispatch, getState) => {
  const { loadingHistory, historyLoaded, hasMore, nextCursor } = getState().assistant;
  if (loadingHistory) return 0;
  if (historyLoaded && !hasMore) return 0;

  dispatch({ type: ASSISTANT_HISTORY_START });

  try {
    const { data } = await api.fetchAssistantHistory(historyLoaded ? nextCursor : undefined);
    dispatch({
      type: historyLoaded ? ASSISTANT_HISTORY_OLDER : ASSISTANT_HISTORY,
      payload: data,
    });
    return data.messages.length;
  } catch (error) {
    dispatch({
      type: ASSISTANT_ASK_FAIL,
      payload: error.response?.data?.message || 'Could not load chat history.',
    });
    return 0;
  }
};

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
