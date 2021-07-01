import React, { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createMeet } from "../http/requests";
import { authCheckState } from "../store/actions/auth";
import { baseURL } from "../http/api";
import { connectToAllUsers, handleUserJoined } from "./peers";
import {
  leftMeet as peerLeftMeet,
  newMessage,
  peerLeft,
  prevMessages,
  setChat,
  setMeet,
} from "../store/actions/socket";
import * as actionTypes from "../store/constants/socket";

const SocketContext = createContext();

const socket = io(baseURL, { autoConnect: false });

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
  frameRate: 10, //mobile
  facingMode: "user",
};

const ContextProvider = ({ children }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const auth = useSelector((state) => state.auth);
  const meet = useSelector((state) => state.socket.meet);
  const currentChat = useSelector((state) => state.socket.chatID);

  //==== Socket State =================================
  const [CallData, setCallData] = useState({ isReceived: false });
  const [CallAccepted, setCallAccepted] = useState(false);
  const [callTo, setcallTo] = useState(null);
  const [callAboarted, setcallAboarted] = useState(false);
  const peersRef = useRef([]);

  const handleIncomingCall = ({ call_from, meetID }) => {
    console.log("Incoming call .... ");
    setCallData({
      isReceived: true,
      call_from,
      meetID,
    });
  };

  const handlePrevMessages = (messages) => {
    console.log("Saving prev messages...", messages);
    dispatch(prevMessages(messages));
  };

  const handleNewMessage = (message) => {
    dispatch(newMessage(message));
  };
  const handleCallEnded = () => {
    setCallData({ isReceived: false });
    setcallTo(null);
    setCallAccepted(false);
  };

  useEffect(() => {
    if (auth.profile && !socket.connected) {
      socket.auth = { token: auth.token };
      socket.connect();
      socket.on("incoming_call", handleIncomingCall);
      socket.on("callaccepted", handleCallAccepted);
      socket.on("callaborted", handleCallAboart);
      socket.on("prev_messages", handlePrevMessages);
      socket.on("new_message", handleNewMessage);
      socket.on("call_ended", handleCallEnded);
      return () => {
        socket.removeAllListeners("incoming_call");
        socket.removeAllListeners("callaccepted");
        socket.removeAllListeners("prev_messages");
        socket.removeAllListeners("callaborted");
        socket.removeAllListeners("new_message");
        socket.removeAllListeners("call_ended");
      };
    }
  }, [auth.profile]);

  useEffect(() => {
    if (!auth.token) {
      dispatch(authCheckState(history));
    }
  }, [auth.token]);

  //======================== CALLING USER =========================================

  const callUser = async ({ user }) => {
    setcallTo(user);

    let meet = await createMeet(false);
    socket.emit("calluser", { userID: user._id, meetID: meet._id });
    dispatch(setMeet(meet._id));
    dispatch(setChat(meet.chat));

    history.push("/dashboard/calluser");
  };

  const answerCall = () => {
    console.log("Answering incoming call....");
    setCallAccepted(true);
    socket.emit("answercall", { meetID: CallData.meetID, call_from: CallData.call_from._id });
    history.push(`/dashboard/meet/${CallData.meetID}`);
  };

  const rejectCall = () => {
    console.log("Rejeceing incoming call.....");
    socket.emit("rejectcall", { meetID: CallData.meetID, userID: CallData.call_from._id });
    setCallData({ isReceived: false });
  };

  const endCall = () => {
    console.log("Ending current call....");
    socket.emit("end_call", callTo._id);
    setCallData({ isReceived: false });
    setcallTo(null);
    history.push("/dashboard");
  };

  const handleCallAccepted = (meetID) => {
    console.log("Call accepted....");
    setCallAccepted(true);
    history.push(`/dashboard/meet/${meetID}`);
  };

  const handleCallAboart = (meetID) => {
    console.log("Call aboarted...");
    setcallAboarted(true);
    setcallTo(null);
    setCallData({ isReceived: false });
    setCallAccepted(false);
  };

  const sendMessage = (message, reply_to = null) => {
    let isMeet = meet != null;
    socket.emit("new_message", { chatID: currentChat, content: message, isMeet, meet, reply_to });
  };

  //================================= VIDEO CALL ==================================

  const leftMeet = (peerID) => {
    console.log("user left chat", peerID);
    peersRef.current = peersRef.current.filter((p) => p.peerID != peerID);
    dispatch(peerLeft(peerID));
  };

  const allUsers = ({ users, chatID }, stream) => {
    console.log("Setting new chat", chatID);
    dispatch(setChat(chatID));
    connectToAllUsers(users, dispatch, peersRef, stream, auth.userID);
  };

  const newUser = (payload, stream) => {
    console.log("New user joinded....", payload);
    handleUserJoined(payload, dispatch, stream, auth.userID, peersRef);
  };

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
        console.log("My video stream ", stream);
        dispatch({
          type: actionTypes.SET_USER_VIDEO,
          payload: stream,
        });
        socket.emit("join_meet", meetID);
        socket.on("users_in_meet", (payload) => allUsers(payload, stream));

        socket.on("user_joined", (payload) => newUser(payload, stream));
        socket.on("receive_signal_back", receiveSignalBack);
        socket.on("left_meet", leftMeet);
      })
      .catch((err) => {
        console.log(err);
      });

    const cleanup = () => {
      socket.removeAllListeners("receive_signal_back");
      socket.removeAllListeners("left_meet");
      socket.removeAllListeners("user_joined");
      socket.removeAllListeners("users_in_meet");
    };

    return cleanup;
  };
  //=========================== GROUP MEET ====================================

  const groupMeet = async (chatID) => {
    let meet = await createMeet(true);
    socket.emit("create_group_meet", { meetID: meet._id, chatID });
    dispatch(setMeet(meet._id));
    history.push("/dashboard/meet/" + meet._id);
  };

  const reinitialize = () => {
    socket.removeAllListeners("receive_signal_back");
    socket.removeAllListeners("left_meet");
    socket.removeAllListeners("user_joined");
    socket.removeAllListeners("users_in_meet");
    setCallData({ isReceived: false });
    setCallAccepted(false);
    setcallTo(null);
    setcallAboarted(false);
    dispatch(peerLeftMeet());
    peersRef.current = [];
  };

  const leaveCall = () => {
    reinitialize();
    socket.emit("leavecall", { user: auth.profile });
    history.push("/dashboard");
  };

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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
export { SocketContext, ContextProvider, socket };
