import React, { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createMeet } from "../http/requests";
import { authCheckState } from "../store/actions/auth";
import { connectToAllUsers, handleUserJoined } from "./peers";

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

  //==== Socket State =================================
  const [CallData, setCallData] = useState({ isReceived: false });
  const [CallAccepted, setCallAccepted] = useState(false);
  const [meet, setmeet] = useState(null);
  const [currentChat, setcurrentChat] = useState(null);
  const [callTo, setcallTo] = useState(null);
  const [callAboarted, setcallAboarted] = useState(false);
  const [peers, setpeers] = useState([]);
  const peersRef = useRef([]);
  const userVideoStream = useRef();

  const handleIncomingCall = ({ call_from, meet }) => {
    console.log("Incoming call .... ");
    setCallData({
      isReceived: true,
      call_from,
      meet,
    });
  };
  useEffect(() => {
    if (auth.profile && !socket.connected) {
      socket.auth = { token: auth.token };
      socket.connect();
      socket.on("incoming_call", handleIncomingCall);
      socket.on("callaccepted", handleCallAccepted);
      socket.on("callaborted", handleCallAboart);
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
    socket.emit("calluser", { user, meet });
    setmeet(meet);
    setcurrentChat(meet.chat);
    history.push("/dashboard/calluser");
  };

  const answerCall = () => {
    setCallAccepted(true);
    socket.emit("answercall", { meet: CallData.meet, call_from: CallData.call_from });
    history.push(`/dashboard/meet/${CallData.meet._id}`);
  };

  const rejectCall = () => {
    socket.emit("rejectcall", { meet: CallData.meet, user: CallData.call_from });
    setCallData({ isReceived: false });
  };

  const handleCallAccepted = ({ meet }) => {
    setCallAccepted(true);
    history.push(`/dashboard/meet/${meet._id}`);
  };

  const handleCallAboart = ({ meet }) => {
    setcallAboarted(true);
    setcallTo(null);
    setCallData({ isReceived: false });
    setmeet(null);
    setCallAccepted(false);
  };

  //================================= VIDEO CALL ==================================

  const initializeVideoCall = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: videoConstraints,
        audio: true,
      })
      .then((stream) => {
        userVideoStream.current.srcObject = stream;
        socket.on("join_meet", { meet });
        socket.on("users_in_meet", (users) => {
          connectToAllUsers(users, setpeers, peersRef, stream);
        });
        socket.on("user_joined", (payload) => handleUserJoined(payload, setpeers, stream));
        socket.on("receive_signal_back", (payload) => {
          const peerRef = peersRef.current.find((p) => p.peerID === payload.id);
          if (peerRef != -1) {
            peerRef.peer.signal(payload.signal);
          }
        });
      });
  };
  //=========================== GROUP MEET ====================================

  const groupMeet = async (chat_id) => {
    let meet = await createMeet(user, "group");
    socket.emit("create_group_meet", { user, meet, chat_id });
    setmeet(meet);
  };

  const reinitialize = () => {
    setCallData({ isReceived: false });
    setCallAccepted(false);
    setcurrentChat(null);
    setmeet(null);
    setcallTo(null);
    setcallAboarted(false);
  };

  const leaveCall = () => {
    reinitialize();
    socket.emit("leavecall", { user: auth.profile });
    history.push("/dashboard/call");
  };

  return (
    <SocketContext.Provider
      value={{
        CallData,
        CallAccepted,
        answerCall,
        leaveCall,
        socket,
        meet,
        callUser,
        groupMeet,
        currentChat,
        callTo,
        reinitialize,
        rejectCall,
        callAboarted,
        initializeVideoCall,
        peers,
        peersRef,
        userVideoStream,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
export { SocketContext, ContextProvider, socket };
