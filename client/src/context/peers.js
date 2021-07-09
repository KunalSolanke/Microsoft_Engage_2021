import Peer from "simple-peer";
import { connectPeers, addPeer as newPeer } from "../store/actions/socket";
import { socket } from "./GlobalSocketContext";
export const env = process.env.REACT_APP_ENV || "dev";
const peerOptions = {
  config: {
    iceServers: [
      {
        urls: ["turn:44.193.11.0:3478?transport=tcp"],
        username: "engage",
        credential: "engage",
      },
    ],
  },
};

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
