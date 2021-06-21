import Peer from "simple-peer";
import { connectPeers, addPeer as newPeer } from "../store/actions/socket";
import { socket } from "./GlobalSocketContext";
export const env = process.env.REACT_APP_ENV || "dev";
const baseURL = env == "dev" ? "localhost" : "engage_backend.voldemort.wtf";
const peerOptions = {
  host: baseURL,
  port: 9000,
  path: "/myapp",
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
      user: payload.user,
    };
    peersRef.current.push({
      peerID: payload.callerID,
      peer,
    });

    dispatch(newPeer(peer));
  }
};

export { handleUserJoined, connectToAllUsers };
