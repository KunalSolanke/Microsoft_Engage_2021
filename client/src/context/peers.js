import Peer from "simple-peer";
import { connectPeers, addPeer as newPeer } from "../store/actions/socket";
import { socket } from "./GlobalSocketContext";
export const env = process.env.REACT_APP_ENV || "dev";
const turnUri = process.env.REACT_APP_TURN_URI;
/**
 * Peer connection options
 */
const peerOptions = {
  config: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
      {
        urls: [turnUri],
        username: "engage",
        credential: "engage",
      },
    ],
  },
};

/**
 * Create new peer,and signal it current userStream from camera
 * @param {signal} userTosignal
 * @param {object} caller
 * @param {MediaStream} stream
 */
const createPeer = (userTosignal, caller, stream) => {
  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream,
    ...peerOptions,
  });
  peer.on("signal", (signal) => {
    console.log("Sending signal");
    socket.emit("send_signal", { userTosignal, caller, signal });
  });
  //peer._debug = console.log;
  return peer;
};

/**
 * Handle coonecting to all the users inside meet,on joinng the meet
 * @param {Array} users
 * @param {Function} dispatch
 * @param {Array} peersRef
 * @param {MediaStream} stream
 * @param {string} userID
 * Create peer connecting with each of users and saves their stream inside global state
 */
const connectToAllUsers = (users, dispatch, peersRef, stream, userID) => {
  console.log(userID);
  const peers = [];
  users.forEach((user) => {
    if (user._id != userID) {
      const peer = createPeer(user._id, userID, stream);
      peersRef.current.push({
        peerID: user._id,
        peer,
      });
      peers.push({
        peerID: user._id,
        peer,
        user,
        muted: false,
        videoPaused: false,
        onDeck: false,
        isPinned: false,
      });
    }
  });
  dispatch(connectPeers(peers));
};

/**
 * Handle new user joining the meeting
 * @param {Object} incomingSignal
 * @param {Object} callerID
 * @param {MediaStream} stream currUserstream
 * create new peer and add new stream
 */
const addPeer = (incomingSignal, callerID, stream) => {
  const peer = new Peer({
    initiator: false,
    trickle: false,
    stream,
  });
  peer.on("signal", (signal) => {
    socket.emit("return_signal", { signal, callerID });
  });
  peer.signal(incomingSignal);
  return peer;
};

/**
 * New user joining the ground
 * @param {Object} payload  user data
 * @param {Function} dispatch
 * @param {MediaStream} stream MediaStream
 * @param {string} userID currentUserID
 * @param {Array} peersRef allpeers
 */
const handleUserJoined = (payload, dispatch, stream, userID, peersRef) => {
  if (payload.id != userID) {
    let peer = addPeer(payload.signal, payload.id, stream);
    peer = {
      peerID: payload.id,
      peer,
      muted: false,
      videoPaused: false,
      onDeck: false,
      isPinned: false,
      user: payload.user,
    };

    let peers = peersRef.current;

    let index = peers.findIndex((p) => p.peerID == peer.peerID);
    if (index == -1) {
      peersRef.current = [
        ...peers,
        {
          peer: peer.peer,
          peerID: peer.peerID,
        },
      ];
    } else {
      peers[index] = {
        peer: peer.peer,
        peerID: peer.peerID,
      };
      peersRef.current = peers;
    }

    dispatch(newPeer(peer));
  }
};

export { handleUserJoined, connectToAllUsers };
