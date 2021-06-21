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
    if (!peers[peer].streams || peers[peer].streams.length == 0 || !peers[peer].stream[0].active) {
      peers[peer] = action.payload;
    }
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
      return UpdatedObj(state, { peers: [] });
    case actionTypes.SET_CHAT:
      return UpdatedObj(state, { chatID: action.payload });
    case actionTypes.RESET_CHAT:
      return UpdatedObj(state, { chatID: null });
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
    default:
      return state;
  }
};
export default reducer;
