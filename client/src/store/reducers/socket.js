import * as actionTypes from "../constants/socket";
import { UpdatedObj } from "../UpdateObj";

/**
 * socket intial state
 */
const intialState = {
  unseenMessages: [],
  peers: [],
  peerStreams: [],
  currMessages: [],
  chatID: null,
  meet: null,
  isChatActive: false,
  isPeopleActive: false,
  userVideoStream: null,
  cameraStream: null,
  screenOn: false,
  deck_limit: 2,
  mediaState: {
    videoPaused: false,
    muted: false,
  },
  userDeckOn: false,
};

const newMessage = (state, action) => {
  return UpdatedObj(state, action.payload);
};

const prevMessages = (state, action) => {
  return UpdatedObj(state, {
    currMessages: action.payload,
  });
};

/**
 * add new peer ,is someone is pinned add new user to deck
 * @param {*} state
 * @param {*} action
 */
const addPeer = (state, action) => {
  let peers = state.peers;
  let peer = peers.findIndex((p) => p.peerID == action.payload.peerID);
  let deckCount = peers.filter((p) => p.onDeck).length;
  let isPinned = peers.findIndex((p) => p.isPinned);
  if (isPinned == -1 && deckCount < state.deck_limit) {
    action.payload = {
      ...action.payload,
      onDeck: true,
    };
  }
  if (peer == -1) {
    peers = [...peers, action.payload];
  } else {
    peers[peer] = action.payload;
  }
  return UpdatedObj(state, {
    peers,
    userDeckOn: isPinned != -1 ? true : state.userDeckOn,
  });
};

const connectPeers = (state, action) => {
  return UpdatedObj(state, {
    peers: [...state.peers, ...action.payload],
  });
};

const peerLeft = (state, action) => {
  let peers = state.peers.filter((p) => p.peerID != action.payload);
  return UpdatedObj(state, {
    peers,
  });
};

/**
 * set stream of new user ,if peer already exist replace the stream
 * @param {*} state
 * @param {*} action
 */
const setPeerStream = (state, action) => {
  let connectedPeerStreams = state.peerStreams;
  console.log(state);
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

/**
 * Link all the action of socket
 * @param {*} state
 * @param {*} action
 */
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
      return UpdatedObj(state, {
        peers: [],
        peerStreams: [],
        userVideoStream: null,
        cameraStream: null,
        chatID: null,
        meet: null,
        mediaState: {
          videoPaused: false,
          muted: false,
        },
        userDeckOn: false,
        screenOn: false,
        isChatActive: false,
        isPeopleActive: false,
      });
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
    case actionTypes.UPDATE_PEER_STREAMS:
      return UpdatedObj(state, {
        peerStreams: action.payload,
      });
    case actionTypes.UPDATE_PEERS:
      return UpdatedObj(state, {
        peers: action.payload,
      });
    case actionTypes.SET_MEDIA_STATE:
      return UpdatedObj(state, {
        mediaState: {
          ...state.mediaState,
          ...action.payload,
        },
      });
    case actionTypes.TOGGLE_DECK:
      return UpdatedObj(state, {
        userDeckOn: action.payload ? action.payload : !state.userDeckOn,
      });
    default:
      return state;
  }
};
export default reducer;
