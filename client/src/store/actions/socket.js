import { connectToAllUsers, handleUserJoined } from "../../context/peers";
import * as actionTypes from "../constants/socket";
import { setNotification } from "../actions/auth";
export const addPeer = (peerObj) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: actionTypes.ADD_PEER,
        payload: peerObj,
      });

      if (!peerObj.peer.destroyed)
        peerObj.peer.on("stream", (stream) =>
          dispatch({
            type: actionTypes.SET_PEER_STREAM,
            payload: {
              ...peerObj,
              stream,
            },
          })
        );
      dispatch(
        setNotification(
          "New user joined",
          `${peerObj?.user?.username} joined the meet`,
          "info-square"
        )
      );
    } catch (err) {
      dispatch(
        setNotification(
          "Warning:Failed to propely connect",
          err.message + "\nPlease try refreshing",
          "warning"
        )
      );
    }
  };
};

export const connectPeers = (peers) => {
  return async (dispatch, getState) => {
    try {
      for (let peerObj of peers) {
        dispatch({
          type: actionTypes.ADD_PEER,
          payload: peerObj,
        });
        if (!peerObj.peer.destroyed) {
          peerObj.peer.on("stream", (stream) => {
            dispatch({
              type: actionTypes.SET_PEER_STREAM,
              payload: {
                ...peerObj,
                stream,
              },
            });
          });
        }
      }
    } catch (err) {
      dispatch(
        setNotification(
          "Warning:Something went wrong while connecting",
          err.message + "\nPlease try refreshing",
          "warning"
        )
      );
    }
  };
};

export const newMessage = (message) => {
  return async (dispatch, getState) => {
    let unseenMessages = getState().socket.unseenMessages;
    let currMessages = getState().socket.currMessages;
    if (message.chat != getState().socket.chatID) {
      unseenMessages = [...unseenMessages, message];
    } else {
      currMessages = [...currMessages, message];
      dispatch(setNotification("New message", "You received new message", "info-square"));
    }
    dispatch({
      type: actionTypes.NEW_MESSAGE,
      payload: {
        currMessages,
        unseenMessages,
      },
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
    try {
      let peer = getState().find((p) => p.peerID == peerID);
      if (peer)
        dispatch(
          setNotification("Notification", `${peer?.user?.username} left the meet"`, "info-square")
        );
      dispatch({
        type: actionTypes.PEER_LEFT,
        payload: peerID,
      });
      dispatch({
        type: actionTypes.REMOVE_PEER_VIDEO,
        payload: peerID,
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const setChat = (chatID) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: actionTypes.SET_CHAT,
        payload: chatID,
      });
    } catch (err) {
      console.log(err);
    }
  };
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
  return async (dispatch, getState) => {
    try {
      try {
        getState()
          .socket.userVideoStream.getTracks()
          .forEach((track) => {
            track.stop();
          });

        getState()
          .socket.cameraStream.getTracks()
          .forEach((track) => {
            track.stop();
          });
      } catch (err) {
        console.log(err);
      }

      dispatch({
        type: actionTypes.LEFT_MEET,
      });
    } catch (err) {
      console.log(err);
    }
  };
};

const setUserVideo = (stream) => {
  return async (dispatch, getState) => {
    try {
      let peerIndex = getState().socket.peerStreams?.findIndex(
        (p) => p.peerID == getState().auth.userID
      );
      let userStream = getState().socket.userVideoStream;
      let newStream = stream;
      if (!newStream.getAudioTracks()[0]) {
        newStream.addTrack(userStream.getAudioTracks()[0]);
      }
      dispatch({
        type: actionTypes.SET_USER_VIDEO,
        payload: newStream,
      });
      if (peerIndex != -1) {
        let peers = getState().socket.peerStreams;
        peers[peerIndex] = {
          ...peers[peerIndex],
          stream: newStream,
        };
        dispatch({
          type: actionTypes.UPDATE_PEER_STREAMS,
          payload: peers,
        });
      }
    } catch (err) {
      dispatch(
        setNotification(
          "Warning:Please make sure media is enabled",
          err.message + "\nPlease try refreshing",
          "warning"
        )
      );
    }
  };
};

export const startShare = (stream) => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: actionTypes.SET_SCREEN,
        payload: true,
      });
      let videoTrack = stream.getTracks()[0];
      let cameraStream = (await getState()).socket.cameraStream;
      let peers = (await getState()).socket.peers || [];
      peers = peers.filter((p) => p.peerID != getState().auth.userID);
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
        peers = peers.filter((p) => p.peerID != getState().auth.userID);
        for (let { peer } of peers) {
          peer.replaceTrack(
            peer.streams[0].getVideoTracks()[0],
            cameraStream.getVideoTracks()[0],
            peer.streams[0]
          );
        }
        dispatch(setUserVideo(cameraStream));
      };
      dispatch(setUserVideo(stream));
    } catch (err) {
      dispatch(
        setNotification("Screen Share error", "Couldn't share screen with all peers", "warning")
      );
    }
  };
};

export const stopShare = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: actionTypes.SET_SCREEN,
        payload: false,
      });
      let userStream = getState().socket.userVideoStream;
      userStream.getVideoTracks()[0].stop();
      let cameraStream = (await getState()).socket.cameraStream;
      let peers = (await getState()).socket.peers;
      peers = peers.filter((p) => p.peerID != getState().auth.userID);
      for (let { peer } of peers) {
        peer.replaceTrack(
          peer.streams[0].getVideoTracks()[0],
          cameraStream.getVideoTracks()[0],
          peer.streams[0],
          "warning"
        );
      }
      dispatch(setUserVideo(cameraStream));
    } catch (err) {
      dispatch(setNotification("warn:Stop share", "Some peer might have left", "warning"));
    }
  };
};

export const connectAlPeers = ({ users, chatID }, peersRef) => {
  return async (dispatch, getState) => {
    try {
      console.log("Setting new chat", chatID);
      let stream = getState().socket.userVideoStream;
      dispatch(setChat(chatID));
      connectToAllUsers(users, dispatch, peersRef, stream, getState().auth.userID);
    } catch (err) {
      dispatch(
        setNotification(
          "Incomplete peer connection",
          "Some connection was broken.Try reload.",
          "warning"
        )
      );
    }
  };
};

export const addNewPeer = (payload, peersRef) => {
  return async (dispatch, getState) => {
    try {
      let stream = getState().socket.userVideoStream;
      console.log("New user joinded....", payload);
      handleUserJoined(payload, dispatch, stream, getState().auth.userID, peersRef);
    } catch (err) {
      dispatch(
        setNotification(
          "Incomplete peer connection",
          "Connection was broken.Try reload.",
          "warning"
        )
      );
    }
  };
};

export const pinUser = (userID) => {
  return async (dispatch, getState) => {
    try {
      let peers = getState().socket.peers;
      let pinnedPeerIndex = peers.findIndex((p) => p.peerID == userID);
      if (pinnedPeerIndex != -1) {
        peers = peers.map((peer) => {
          peer.onDeck = false;
          return peer;
        });
        peers[pinnedPeerIndex].isPinned = true;
        peers[pinnedPeerIndex].onDeck = true;
        dispatch({
          type: actionTypes.UPDATE_PEERS,
          payload: peers,
        });
      }
    } catch (err) {
      dispatch(setNotification("Warn:coonection err", "Connection might be broken", "warning"));
    }
  };
};

export const unPinUser = (userID) => {
  return async (dispatch, getState) => {
    try {
      let peers = getState().socket.peers;
      peers = peers.map((peer) => {
        peer.isPinned = false;
        peer.onDeck = false;
        return peer;
      });

      for (let i = 0; i < getState().socket.deck_limit && i < peers.length; i++) {
        peers[i] = {
          ...peers[i],
          onDeck: true,
        };
      }
      dispatch({
        type: actionTypes.TOGGLE_DECK,
        payload: true,
      });

      dispatch({
        type: actionTypes.UPDATE_PEERS,
        payload: peers,
      });
    } catch (err) {
      dispatch(
        setNotification(
          "Warning:Pin user failed due to network error",
          err.message + "\nPlease try refreshing"
        )
      );
    }
  };
};

export const addUsertoDeck = (userID) => {
  return async (dispatch, getState) => {
    try {
      const deck_limit = getState().socket.deck_limit;
      let peers = getState().socket.peers;
      let addPeerIndex = peers.findIndex((p) => p.peerID == userID);

      if (addPeerIndex != -1) {
        peers = peers.map((p) => {
          p.isPinned = false;
          return p;
        });
        let currDeckCount = peers.filter((p) => p.onDeck).length;
        if (currDeckCount >= deck_limit) {
          let popUserIndex = peers.findIndex((p) => p.onDeck);
          if (popUserIndex != -1) peers[popUserIndex].onDeck = false;
        }
        peers[addPeerIndex].onDeck = true;
        dispatch({
          type: actionTypes.UPDATE_PEERS,
          payload: peers,
        });
      }
    } catch (err) {
      dispatch(
        setNotification(
          "Warning:User you are trying to add maybe disconnected",
          err.message + "\nPlease try refreshing"
        )
      );
    }
  };
};

export const setmediaState = (mediaState, peerID, socket = null, meetID = null) => {
  return async (dispatch, getState) => {
    try {
      let peerStreams = getState().socket.peerStreams;
      let peerIndex = peerStreams.findIndex((p) => p.peerID == peerID);
      if (socket) {
        socket.emit("change_media_state", {
          mediaState,
          meetID,
        });
        dispatch({
          type: actionTypes.SET_MEDIA_STATE,
          payload: mediaState,
        });
      }
      if (peerIndex != -1) {
        peerStreams[peerIndex] = {
          ...peerStreams[peerIndex],
          ...mediaState,
        };
        dispatch({
          type: actionTypes.UPDATE_PEER_STREAMS,
          payload: peerStreams,
        });
      }
    } catch (err) {
      dispatch(
        setNotification(
          "Warning:you may be disconnected",
          err.message + "\nPlease try refreshing",
          "warning"
        )
      );
    }
  };
};

export const enterMeeting = (stream) => {
  return async (dispatch, getState) => {
    const user = getState().auth.profile;
    dispatch({
      type: actionTypes.SET_USER_VIDEO,
      payload: stream,
    });

    dispatch({
      type: actionTypes.SET_CAMERA_STREAM,
      payload: stream,
    });

    dispatch({
      type: actionTypes.ADD_PEER,
      payload: {
        peerID: user._id,
        peer: null,
        user,
        muted: false,
        videoPaused: false,
        onDeck:
          getState().socket.deck_limit == getState().socket.peers.filter((p) => p.onDeck).length
            ? false
            : true,
        isPinned: false,
      },
    });
    dispatch({
      type: actionTypes.SET_PEER_STREAM,
      payload: {
        peerID: user._id,
        peer: null,
        user,
        stream,
        muted: false,
        videoPaused: false,
        onDeck:
          getState().socket.deck_limit == getState().socket.peers.filter((p) => p.onDeck).length
            ? false
            : true,
        isPinned: false,
      },
    });
  };
};
