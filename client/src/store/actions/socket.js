import { connectToAllUsers, handleUserJoined } from "../../context/peers";
import * as actionTypes from "../constants/socket";

export const addPeer = (peerObj) => {
  return async (dispatch, getState) => {
    dispatch({
      type: actionTypes.ADD_PEER,
      payload: peerObj,
    });
    if (!peerObj.peer.destroyed)
      peerObj.peer.on("stream", (stream) =>
        dispatch({
          type: actionTypes.SET_PEER_STREAM,
          payload: {
            peerID: peerObj.peerID,
            muted: false,
            video: false,
            stream,
          },
        })
      );
  };
};

export const connectPeers = (peers) => {
  return async (dispatch, getState) => {
    dispatch({
      type: actionTypes.CONNECT_PEERS,
      payload: peers,
    });
    for (let peerObj of peers) {
      if (!peerObj.peer.destroyed) {
        peerObj.peer.on("stream", (stream) => {
          dispatch({
            type: actionTypes.SET_PEER_STREAM,
            payload: {
              peerID: peerObj.peerID,
              muted: false,
              video: false,
              stream,
            },
          });
        });
      }
    }
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
    dispatch({
      type: actionTypes.REMOVE_PEER_VIDEO,
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

export const startShare = (stream) => {
  return async (dispatch, getState) => {
    dispatch({
      type: actionTypes.SET_SCREEN,
      payload: true,
    });
    let videoTrack = stream.getTracks()[0];
    let cameraStream = (await getState()).socket.cameraStream;
    let peers = (await getState()).socket.peers;
    for (let { peer } of peers) {
      let track = peer.streams[0].getVideoTracks()[0];
      peer.replaceTrack(track, videoTrack, peer.streams[0]);
    }

    videoTrack.onended = () => {
      dispatch({
        type: actionTypes.SET_SCREEN,
        payload: false,
      });
      peers = getState().socket.peers;
      for (let { peer } of peers) {
        peer.replaceTrack(
          peer.streams[0].getVideoTracks()[0],
          cameraStream.getVideoTracks()[0],
          peer.streams[0]
        );
      }
      dispatch({
        type: actionTypes.SET_USER_VIDEO,
        payload: cameraStream,
      });
    };
    dispatch({
      type: actionTypes.SET_USER_VIDEO,
      payload: stream,
    });
  };
};

export const stopShare = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: actionTypes.SET_SCREEN,
      payload: false,
    });
    let userStream = getState().socket.userVideoStream;
    userStream.getVideoTracks()[0].stop();
    let cameraStream = (await getState()).socket.cameraStream;
    let peers = (await getState()).socket.peers;
    for (let { peer } of peers) {
      peer.replaceTrack(
        peer.streams[0].getVideoTracks()[0],
        cameraStream.getVideoTracks()[0],
        peer.streams[0]
      );
    }
    dispatch({
      type: actionTypes.SET_USER_VIDEO,
      payload: cameraStream,
    });
  };
};

export const connectAlPeers = ({ users, chatID }, peersRef) => {
  return async (dispatch, getState) => {
    console.log("Setting new chat", chatID);
    let stream = getState().socket.userVideoStream;
    dispatch(setChat(chatID));
    connectToAllUsers(users, dispatch, peersRef, stream, getState().auth.userID);
  };
};

export const addNewPeer = (payload, peersRef) => {
  return async (dispatch, getState) => {
    let stream = getState().socket.userVideoStream;
    console.log("New user joinded....", payload);
    handleUserJoined(payload, dispatch, stream, getState().auth.userID, peersRef);
  };
};
