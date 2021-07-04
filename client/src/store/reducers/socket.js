import * as actionTypes from "../constants/socket";
import { UpdatedObj } from "../UpdateObj";

const intialState = {
  unseenMessages: [],
  peers: [],
  currMessages: [],
  chatID: null,
  meet: null,
  isChatActive: false,
  isPeopleActive: false,
  userVideoStream: null,
  peerStreams: [],
  cameraStream: null,
  screenOn: false,
  videoPaused: false,
  audioPaused: false,
};

const newMessage = (state, action) => {
  let unseenMessages = state.unseenMessages;
  let currMessages = state.currMessages;
  console.log(action);
  if (action.payload.chat != state.chatID) {
    unseenMessages = [...unseenMessages, action.payload];
  } else {
    currMessages = [...currMessages, action.payload];
  }
  return UpdatedObj(state, {
    currMessages,
    unseenMessages,
  });
};

const prevMessages = (state, action) => {
  return UpdatedObj(state, {
    currMessages: action.payload,
  });
};

const addPeer = (state, action) => {
  let peers = state.peers;
  let peer = peers.findIndex((p) => p.peerID == action.payload.peerID);
  if (peer == -1) {
    peers = [...peers, action.payload];
  } else {
    peers[peer] = action.payload;
  }
  return UpdatedObj(state, {
    peers,
  });
};

const connectPeers = (state, action) => {
  return UpdatedObj(state, {
    peers: action.payload,
  });
};

const peerLeft = (state, action) => {
  let peers = state.peers.filter((p) => p.peerID != action.payload);
  return UpdatedObj(state, {
    peers,
  });
};

const setPeerStream = (state, action) => {
  let connectedPeerStreams = state.peerStreams;
  let streamIndex = connectedPeerStreams.findIndex(
    (stream) => stream.peerID == action.payload.peerID
  );
  if (streamIndex == -1) {
    connectedPeerStreams = [...connectedPeerStreams, action.payload];
  } else {
    connectedPeerStreams[streamIndex] = action.payload;
  }
  return UpdatedObj(state, { peerStreams: connectedPeerStreams });
};

const removePeerStream = (state, action) => {
  let peerStreams = state.peerStreams.filter((p) => p.peerID != action.payload);
  return UpdatedObj(state, { peerStreams });
};

const reducer = (state = intialState, action) => {
  switch (action.type) {
    case actionTypes.NEW_MESSAGE:
      return newMessage(state, action);
    case actionTypes.PREV_MESSAGES:
      return prevMessages(state, action);
    case actionTypes.ADD_PEER:
      return addPeer(state, action);
    case actionTypes.CONNECT_PEERS:
      return connectPeers(state, action);
    case actionTypes.PEER_LEFT:
      return peerLeft(state, action);
    case actionTypes.LEFT_MEET:
      return UpdatedObj(state, { peers: [], peerStreams: [] });
    case actionTypes.SET_CHAT:
      return UpdatedObj(state, { chatID: action.payload, currMessages: [] });
    case actionTypes.RESET_CHAT:
      return UpdatedObj(state, { chatID: null, currMessages: [] });
    case actionTypes.SET_MEET:
      return UpdatedObj(state, { meet: action.payload });
    case actionTypes.RESET_MEET:
      return UpdatedObj(state, { meet: null });
    case actionTypes.CHAT_ACTIVE:
      return UpdatedObj(state, {
        isChatActive: !state.isChatActive,
        isPeopleActive: false,
      });
    case actionTypes.PEOPLE_ACTIVE:
      return UpdatedObj(state, {
        isChatActive: false,
        isPeopleActive: !state.isPeopleActive,
      });
    case actionTypes.SET_USER_VIDEO:
      return UpdatedObj(state, {
        userVideoStream: action.payload,
      });
    case actionTypes.SET_PEER_STREAM:
      return setPeerStream(state, action);
    case actionTypes.REMOVE_PEER_VIDEO:
      return removePeerStream(state, action);
    case actionTypes.SET_CAMERA_STREAM:
      return UpdatedObj(state, {
        cameraStream: action.payload,
      });
    case actionTypes.SET_SCREEN:
      return UpdatedObj(state, {
        screenOn: action.payload,
      });
    case actionTypes.SET_VIDEO_STATE:
      return UpdatedObj(state, {
        videoPaused: action.payload,
      });
    case actionTypes.SET_AUDIO_STATE:
      return UpdatedObj(state, {
        audioPaused: action.payload,
      });
    default:
      return state;
  }
};
export default reducer;
