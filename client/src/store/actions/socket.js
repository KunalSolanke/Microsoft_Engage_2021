import { connectToAllUsers, handleUserJoined } from "../../context/peers";
import * as actionTypes from "../constants/socket";
import { setNotification } from "../actions/auth";
/**
 * Add new peer to global peers array,
 * add get stream listener and add stream to peerStreams array
 * @param {*} peerObj
 * peerObj is of form {
 *    muted:false,
 *    user;{}
 *    videoPaused:false,
 *    peer:Peer object
 *    peerID:userID
 *    userOnDeck:boolean if user is on main deck
 *    isPinned: boolean if user is pinned
 * }
 */
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
      dispatch({
        type: actionTypes.TOGGLE_DECK,
        payload: true,
      });
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

/**
 * Add peers to global peers array just after joinng the metting,
 * add get stream listener and add stream to peerStreams array
 * @param {*} peers
 * peers is array with elements  of form {
 *    muted:false,
 *    user;{}
 *    videoPaused:false,
 *    peer:Peer object
 *    peerID:userID
 *    userOnDeck:boolean if user is on main deck
 *    isPinned: boolean if user is pinned
 * }
 */

export const connectPeers = (peers) => {
  return async (dispatch, getState) => {
    try {
      for (let peerObj of peers) {
        dispatch({
          type: actionTypes.ADD_PEER,
          payload: peerObj,
        });
        if (!peerObj.peer.destroyed) {
          /**Listen to stream listener form peer */
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

/**
 * Redux addMessage action,
 * add getCurrent message and add new message to currMessage | unsessnMessages socket state
 * based on current chatId
 * @param {*} message
 */

export const newMessage = (message) => {
  return async (dispatch, getState) => {
    let unseenMessages = getState().socket.unseenMessages;
    let currMessages = getState().socket.currMessages;
    if (message.chat != getState().socket.chatID) {
      unseenMessages = [...unseenMessages, message];
      dispatch(setNotification("New message", "You received new message", "info-square"));
    } else {
      currMessages = [...currMessages, message];
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

/**
 * Set currMessage equal to message on join new chat
 * @param {Array} messages
 */

export const prevMessages = (messages) => {
  return async (dispatch, getState) => {
    dispatch({
      type: actionTypes.PREV_MESSAGES,
      payload: messages,
    });
  };
};

/**
 * handle user left the meet
 * find user by peerID remove from peers and peerStreams socket state
 * @param {string} peerID
 */
export const peerLeft = (peerID) => {
  return async (dispatch, getState) => {
    try {
      let peer = getState().socket.peers.find((p) => p.peerID == peerID);
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

/**set current chat on click on /joining new chat */
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

/**
 * handle user left meet
 * get currentUser stream and cameraStream and stop its track
 * se socket state to default socket state
 */
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

/**
 * set global userVideoStream:MediaStream to stream
 * @param {MediaStream} stream
 * Also replace stream from my peers/peerstreams array
 * if audioTracks are not availbale(screenShare) add cameraStream's audio track
 */
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

/**
 * Get user screen stream and replace video track of ecah of the
 * peers and peerstream with screen share stream track
 * @param {MediaStream} stream
 * set user stream to screenShare stream
 */
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

      /**
       * on scren share end
       * replace video track from each of the peers/peerStrams to
       * videoTrack from cameraStream
       * set user stream to cameraStream
       */
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
/**
 * handle stop screen share button
 * replace video track from each of the peers/peerStrams to
 * videoTrack from cameraStream
 * set user stream to cameraStream
 */

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

/**
 * On join meet handle making peer connection to users
 * @param {*} data   users arary and chat/meetID
 * @param {*} peersRef
 */
export const connectAlPeers = ({ users, chatID }, peersRef) => {
  return async (dispatch, getState) => {
    try {
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
/**
 * Add new peer joined in meet to global peers array and get its stream
 * @param {*} payload
 * @param {*} peersRef
 */
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

/**
 * handle pin user
 * find peer with userID,and set isPinned:true,useronDeck:true ,false for rest
 * @param {*} userID user to pin
 */
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

/**
 * handle unpin user
 * find peer with userID,and set isPinned:false,useronDeck:false;
 * set userDeckon true for deckCount :sokcet.deck_limit(2) no. of peers
 * @param {*} userID user to unpin
 */
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
    }catch (err) {
      dispatch(
        setNotification(
          "Warning:Pin user failed due to network error",
          err.message + "\nPlease try refreshing"
        )
      );
    }
  };
};

/**
 * handle add user todeck
 * set isPinned false is pinned and
 * set userOnDeck true for peer with userID
 * @param {*} userID  user to add
 */
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

/**
 * handle change in audio or video state of the peer
 * if peerchanged is current user broacast set metdia state to whole meeting
 * change mediaValues of user in peers and peerStreams array
 * @param {*} userID  user to add
 */
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

/**
 * On entring meet add currentUser stream to peers array and peerStreams array
 * setChat and setMeet variables
 * @param {MediaStream} stream
 */

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
