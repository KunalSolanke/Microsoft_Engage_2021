import React, { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createMeet } from "../http/requests";
import { authCheckState, setNotification } from "../store/actions/auth";
import { baseURL } from "../http/api";
import {
  addNewPeer,
  connectAlPeers,
  enterMeeting,
  leftMeet as peerLeftMeet,
  newMessage,
  peerLeft,
  prevMessages,
  setChat,
  setmediaState,
  setMeet,
  startShare,
  stopShare,
} from "../store/actions/socket";
import * as actionTypes from "../store/constants/socket";

const SocketContext = createContext();

const socket = io(baseURL, { autoConnect: false });

/**
 * @object
 * user video capture constraints
 */
const videoConstraints = {
  height: window.innerHeight,
  width: window.innerWidth,
  frameRate: 10, //mobile
  facingMode: "user",
};

/**
 * Context for all socket related events throght the application
 * @compoent
 *
 */
const ContextProvider = ({ children }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const token = useSelector((state) => state.auth.token);
  const meet = useSelector((state) => state.socket.meet);
  const currentChat = useSelector((state) => state.socket.chatID);

  /**  Socket state */
  const [CallData, setCallData] = useState({ isReceived: false });
  const [CallAccepted, setCallAccepted] = useState(false);
  const [callTo, setcallTo] = useState(null);
  const [callAboarted, setcallAboarted] = useState(false);
  const peersRef = useRef([]);

  /**
   * Function that recieve incoming call and sets current call data
   * @param {*} param
   */
  const handleIncomingCall = ({ call_from, meetID }) => {
    console.log("Incoming call .... ");
    setCallData({
      isReceived: true,
      call_from,
      meetID,
    });
  };

  /**
   * On connecting to a chat,get all the prev messages and set inside global state
   * @param {Array} messages
   *
   */

  const handlePrevMessages = (messages) => {
    console.log("Saving prev messages...", messages);
    dispatch(prevMessages(messages));
  };

  /**
   * Handles new message socket event and add new message in global state
   * @param {} message
   */
  const handleNewMessage = (message) => {
    console.log("Saved new message ", message);
    dispatch(newMessage(message));
  };

  /**
   * Resets all the call state to default with 1-1 call in aborted
   */
  const handleCallEnded = () => {
    setCallData({ isReceived: false });
    setcallTo(null);
    setCallAccepted(false);
  };

  /**
   * List all the socket events to listen to
   * incoming call : Show incoming call tile
   * callaborted ; reset call state
   * callaccepted: redirect to meeting area
   * prev message : fetch all previous message of current chat
   * new message : set new message with corresponding chatID
   */
  console.log("updateed the auth", token);
  useEffect(() => {
    console.log("Attempting to connect to socket");
    if (token) {
      if (socket.connected) socket.disconnect();
      socket.auth = { token: token };
      socket.connect();
      socket.on("incoming_call", handleIncomingCall);
      socket.on("callaccepted", handleCallAccepted);
      socket.on("callaborted", handleCallAboart);
      socket.on("prev_messages", handlePrevMessages);
      socket.on("new_message", handleNewMessage);
      socket.on("call_ended", handleCallEnded);
      return () => {
        /** remove event listeners to avoid multiple connections */
        socket.removeAllListeners("incoming_call");
        socket.removeAllListeners("callaccepted");
        socket.removeAllListeners("prev_messages");
        socket.removeAllListeners("callaborted");
        socket.removeAllListeners("new_message");
        socket.removeAllListeners("call_ended");
      };
    }
  }, [token]);

  /**
   * If auth state fails try to refresh the token once before logging user out
   */
  useEffect(() => {
    if (!token) {
      dispatch(authCheckState(history));
    }
  }, [token]);

  //======================== CALLING USER =========================================
  /**
   * Make call to user,which triggers incoming call for call-to user
   * Create new meeting with two users
   * @param {*} {user} user to call to
   * @param {*} data if chatId is avaiblabe use same chat inside meet
   */
  const callUser = async ({ user }, data = {}) => {
    setcallTo(user);
    let meet = await createMeet(false, { ...data, userID: user._id });
    socket.emit("calluser", { userID: user._id, meetID: meet._id });
    dispatch(setMeet(meet._id));
    dispatch(setChat(meet.chat));

    history.push("/dashboard/calluser");
  };

  /**
   * Answer incoming call and sends back callaccepted event to callee
   */
  const answerCall = () => {
    console.log("Answering incoming call....");
    setCallAccepted(true);
    socket.emit("answercall", { meetID: CallData.meetID, call_from: CallData.call_from._id });
    history.push(`/dashboard/meet/${CallData.meetID}`);
  };

  /**Rejects incoming call and sends back callrejected event to callee */

  const rejectCall = () => {
    console.log("Rejeceing incoming call.....");
    socket.emit("rejectcall", { meetID: CallData.meetID, userID: CallData.call_from._id });
    setCallData({ isReceived: false });
  };

  /** End call started by current user */
  const endCall = () => {
    console.log("Ending current call....");
    socket.emit("end_call", callTo._id);
    setCallData({ isReceived: false });
    setcallTo(null);
    history.push("/dashboard");
  };

  /** event handler for call accepted,
   * if person being called accepts,redirect to
   * meet area
   */
  const handleCallAccepted = (meetID) => {
    console.log("Call accepted....");
    setCallAccepted(true);
    history.push(`/dashboard/meet/${meetID}`);
  };

  /**
   * reset meet status aborting the call
   * @param {*} meetID
   */
  const handleCallAboart = (meetID) => {
    console.log("Call aboarted...");
    setcallAboarted(true);
    setcallTo(null);
    setCallData({ isReceived: false });
    setCallAccepted(false);
  };

  /**
   * Handle sending message to socket room using global chatId variable
   * @param {} message
   * @param {object} reply_to
   */

  const sendMessage = (message, reply_to = null) => {
    let isMeet = meet != null;
    socket.emit("new_message", { chatID: currentChat, content: message, isMeet, meet, reply_to });
  };

  //================================= VIDEO CALL ==================================

  /** reset all state to default,handles end call inside meeting */
  const leftMeet = (peerID) => {
    console.log("user left chat", peerID);
    peersRef.current = peersRef.current.filter((p) => p.peerID != peerID);
    dispatch(peerLeft(peerID));
  };

  /** Simple peer event,handle received signal back from the peer initially signalled */
  const receiveSignalBack = (payload) => {
    console.log("Receive signal back", payload);
    const peerRef = peersRef.current.findIndex((p) => p.peerID === payload.id);
    console.log("found a user peer to signal to ... ", peerRef);
    console.log(peersRef);
    if (peerRef != -1 && !peersRef.current[peerRef].destroyed) {
      try {
        peersRef.current[peerRef].peer.signal(payload.signal);
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("No peer found");
    }
  };

  /**
   * Start video call,get userStream and connect to meeting
   * @param {string} meetID
   * substribe to event on join meet,
   * users_in_meet : get list of users inside meet
   * user_joined : get new user joined data
   * left_meet : get user who left meet
   * change_media_state : get change in media state of peer {audio,video}
   */
  const initializeVideoCall = (meetID) => {
    navigator.mediaDevices.getUserMedia =
      navigator.mediaDevices.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    dispatch(setMeet(meetID));
    navigator.mediaDevices
      .getUserMedia({
        video: videoConstraints,
        audio: true,
      })
      .then((stream) => {
        dispatch(enterMeeting(stream));
        socket.emit("join_meet", meetID);
        socket.on("users_in_meet", (payload) => dispatch(connectAlPeers(payload, peersRef)));
        socket.on("user_joined", (payload) => dispatch(addNewPeer(payload, peersRef)));
        socket.on("receive_signal_back", receiveSignalBack);
        socket.on("left_meet", leftMeet);
        socket.on("change_media_state", ({ mediaState, peerID }) => {
          dispatch(setmediaState(mediaState, peerID));
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch(setNotification("Media Error", `Please make sure media is allowed`, "error"));
      });
  };

  //=========================== START SCREEN SHARE ==================
  /**Initiate screen share */
  const startScreenShare = () => {
    navigator.mediaDevices
      .getDisplayMedia({
        cursor: true,
      })
      .then((stream) => {
        dispatch(startShare(stream));
      })
      .catch((err) => console.log(err));
  };

  const stopScreenShare = () => {
    dispatch(stopShare());
  };

  //=========================== GROUP MEET ====================================

  /**Creating group meet api
   * @param {string} chatID
   *
   */
  const groupMeet = async (chatID) => {
    let meet = await createMeet(true, { chatID });
    socket.emit("create_group_meet", { meetID: meet._id, chatID });
    dispatch(setMeet(meet._id));
    history.push("/dashboard/meet/" + meet._id);
  };

  /**
   * Function that resets the component state,unsubsribes to all the events
   * inside intializeMeet on leaving the meet
   */
  const reinitialize = () => {
    socket.removeAllListeners("receive_signal_back");
    socket.removeAllListeners("left_meet");
    socket.removeAllListeners("user_joined");
    socket.removeAllListeners("users_in_meet");
    socket.removeAllListeners("change_media_state");
    setCallData({ isReceived: false });
    setCallAccepted(false);
    setcallTo(null);
    setcallAboarted(false);
    dispatch(peerLeftMeet());
    peersRef.current = [];
  };

  const leaveCall = (meetID) => {
    console.log("leaving");
    socket.emit("leave_meet", meetID);
    if (meet) reinitialize();
  };

  /**
   * Provide all the above function to rest to app
   */
  return (
    <SocketContext.Provider
      value={{
        CallData,
        CallAccepted,
        answerCall,
        leaveCall,
        socket,
        callUser,
        groupMeet,
        callTo,
        reinitialize,
        rejectCall,
        callAboarted,
        initializeVideoCall,
        peersRef,
        sendMessage,
        endCall,
        startScreenShare,
        stopScreenShare,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
export { SocketContext, ContextProvider, socket };
