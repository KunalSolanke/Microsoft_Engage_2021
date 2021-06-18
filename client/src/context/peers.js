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

const connectToAllUsers = (users, setpeers, peersRef, stream, userID) => {
  console.log(users);
  const peers = [];
  users.forEach((user) => {
    if (user != userID) {
      const peer = createPeer(user, userID, stream);
      peersRef.current.push({
        peerID: user,
        peer,
        muted: false,
        videoPaused: false,
      });
      peers.push({
        peerID: user,
        peer,
        muted: false,
        videoPaused: false,
      });
    }
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

const handleUserJoined = (payload, setpeers, stream, userID) => {
  if (payload.id != userID) {
    let peer = addPeer(payload.signal, payload.id, stream);
    peer = {
      peerID: payload.id,
      peer,
      muted: false,
      videoPaused: false,
    };
    setpeers((users) => [...users, peer]);
  }
};

export { handleUserJoined, connectToAllUsers };
