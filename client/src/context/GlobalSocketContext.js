import React, { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createMeet } from "../http/requests";
import { authCheckState } from "../store/actions/auth";
import { connectToAllUsers, handleUserJoined } from "./peers";
import {
  leftMeet,
  newMessage,
  peerLeft,
  prevMessages,
  setChat,
  setMeet,
} from "../store/actions/socket";
import * as actionTypes from "../store/constants/socket";

const SocketContext = createContext();

const socket = io("http://localhost:5000", { autoConnect: false });

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
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

  useEffect(() => {
    if (auth.profile && !socket.connected) {
      socket.auth = { token: auth.token };
      socket.connect();
      socket.on("incoming_call", handleIncomingCall);
      socket.on("callaccepted", handleCallAccepted);
      socket.on("callaborted", handleCallAboart);
      socket.on("prev_messages", handlePrevMessages);
      socket.on("new_message", handleNewMessage);
      return () => {
        socket.off("incoming_call", handleIncomingCall);
        socket.off("callaccepted", handleCallAccepted);
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
    let meet = await createMeet(user);
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

  const sendMessage = (message) => {
    let isMeet = meet != null;
    socket.emit("new_message", { chatID: currentChat, content: message, isMeet, meet });
  };

  //================================= VIDEO CALL ==================================

  const initializeVideoCall = (meetID) => {
    console.log(meetID);
    dispatch(setMeet(meetID));
    navigator.mediaDevices
      .getUserMedia({
        video: videoConstraints,
        audio: true,
      })
      .then((stream) => {
        console.log(meetID);
        dispatch({
          type: actionTypes.SET_USER_VIDEO,
          payload: stream,
        });
        socket.emit("join_meet", meetID);
        socket.on("users_in_meet", ({ users, chatID }) => {
          console.log("Setting new chat", chatID);
          dispatch(setChat(chatID));
          connectToAllUsers(users, dispatch, peersRef, stream, auth.userID);
        });
        socket.on("user_joined", (payload) => {
          console.log("New user joinded....", payload);
          handleUserJoined(payload, dispatch, stream, auth.userID, peersRef);
        });
        socket.on("receive_signal_back", (payload) => {
          console.log("Receive signal back", payload);
          const peerRef = peersRef.current.find((p) => p.peerID === payload.id);
          if (peerRef != -1 && !peerRef.destroyed) {
            peerRef.peer.signal(payload.signal);
          } else {
            console.log("No peer found");
          }
        });
        socket.on("left_chat", (peerID) => {
          console.log("user left chat", peerID);
          peersRef.current = peersRef.current.filter((p) => p.peerID != peerID);
          dispatch(peerLeft(peerID));
        });
      });
  };
  //=========================== GROUP MEET ====================================

  const groupMeet = async (chat_id) => {
    let meet = await createMeet(user, "group");
    socket.emit("create_group_meet", { user, meet, chat_id });
    dispatch(setMeet(meet._id));
  };

  const reinitialize = () => {
    setCallData({ isReceived: false });
    setCallAccepted(false);
    setcallTo(null);
    setcallAboarted(false);
    dispatch(leftMeet());
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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
export { SocketContext, ContextProvider, socket };
