import * as actionTypes from "../constants/socket";

export const addPeer = (peer) => {
  return async (dispatch, getState) => {
    dispatch({
      type: actionTypes.ADD_PEER,
      payload: peer,
    });
  };
};

export const connectPeers = (peers) => {
  return async (dispatch, getState) => {
    dispatch({
      type: actionTypes.CONNECT_PEERS,
      payload: peers,
    });
  };
};

export const newMessage = (message) => {
  return async (dispatch, getState) => {
    dispatch({
      type: actionTypes.NEW_MESSAGE,
      payload: message,
    });
  };
};

export const prevMessages = (messages) => {
  return async (dispatch, getState) => {
    dispatch({
      type: actionTypes.PREV_MESSAGES,
      payload: messages,
    });
  };
};

export const peerLeft = (peerID) => {
  return async (dispatch, getState) => {
    dispatch({
      type: actionTypes.PEER_LEFT,
      payload: peerID,
    });
  };
};

export const setChat = (chatID) => {
  return async (dispatch) =>
    dispatch({
      type: actionTypes.SET_CHAT,
      payload: chatID,
    });
};

export const setMeet = (meet) => {
  return async (dispatch) =>
    dispatch({
      type: actionTypes.SET_MEET,
      payload: meet,
    });
};

export const resetChat = () => {
  return async (dispatch) =>
    dispatch({
      type: actionTypes.RESET_CHAT,
    });
};

export const resetMEET = () => {
  return async (dispatch) =>
    dispatch({
      type: actionTypes.RESET_MEET,
    });
};

export const leftMeet = () => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.LEFT_MEET,
    });
    dispatch(resetChat());
    dispatch(resetMEET());
  };
};
