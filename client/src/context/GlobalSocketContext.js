import React, { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createMeet } from "../http/requests";

const SocketContext = createContext();

const socket = io("http://localhost:5000", { autoConnect: false });

const ContextProvider = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  const [CallData, setCallData] = useState({ isRecieved: false });
  const [CallAccepted, setCallAccepted] = useState(false);
  const [meet, setmeet] = useState(null);
  const [currentChat, setcurrentChat] = useState(null);
  const [callTo, setcallTo] = useState(null);

  const peerConnection = useRef();
  const handleIncomingCall = ({ call_from, meet, signal }) => {
    setCallData({
      isRecieved: true,
      call_from,
      meet,
      signal,
    });
  };

  const handleCallAccepted = ({ meet }) => {
    setCallAccepted(true);
    setmeet(meet);
    history.push(`/dashboard/meet/${meet._id}`);
  };

  const connectMyPeer = () => {
    let peer = new Peer(auth.profile.userID, {
      host: "localhost",
      port: 9000,
      path: "/myapp",
    });
    peerConnection.current = peer;
  };

  useEffect(() => {
    connectMyPeer();
    socket.auth.token = auth.token;
    socket.connect();
    socket.on("incoming_call", handleIncomingCall);
    socket.on("call_accepted", handleCallAccepted);

    return () => {
      socket.off("incoming_call", handleIncomingCall);
    };
  }, []);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (!auth.token) {
      dispatch(authCheckState(history));
    }
  }, [auth.token]);

  const callUser = async ({ user }) => {
    setcallTo(user);
    let meet = await createMeet(user, "individual");
    socket.emit("callUser", { user, meet });
    setmeet(meet);
    setcurrentChat(meet.chat._id);
    history.push("/dashboard/call_user");
  };

  const initiateMyVideoStream = () => {
    let peer = peerConnection.current;
  };

  const connectToNewUser = () => {};

  const groupMeet = async (chat_id) => {
    let meet = await createMeet(user, "group");
    socket.emit("create_group_meet", { user, meet, chat_id });
    setmeet(meet);
  };

  const answerCall = ({ meet }) => {
    setCallAccepted(true);
    socket.emit("answer_call", { meet });
    history.push(`/dashboard/meet/${meet._id}`);
  };

  const leaveCall = () => {
    peerConnection.current.destroy();
    history.push("/dashboard/activity");
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
        initiateMyVideoStream,
        connectToNewUser,
        callTo,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const { SocketContext, ContextProvider, socket };
