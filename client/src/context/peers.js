import Peer from "simple-peer";
import { socket } from "./GlobalSocketContext";
const peerOptions = {
  host: "localhost",
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
    socket.emit("send_signal", { userTosignal, caller, signal });
  });
  return peer;
};

const connectToAllUsers = (users, setpeers, peersRef, stream) => {
  const peers = [];
  users.map((user) => {
    const peer = createPeer(user._id, auth.profile._id, stream);
    peersRef.current.push({
      peerID: user._id,
      peer,
      muted: false,
      videoPaused: false,
    });
    peers.push(peer);
  });
  setpeers(peers);
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

const handleUserJoined = (payload, setpeers, stream) => {
  const peer = addPeer(payload.signal, payload.id, stream);
  setpeers((users) => [...users, peer]);
};

export { handleUserJoined, connectToAllUsers };
