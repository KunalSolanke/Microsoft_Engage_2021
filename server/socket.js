const socketAuth = require("./middlewares/socketAuth");
const { User } = require("./models");
const {
  leaveMeet,
  addParticipants,
  createNewMessage,
  getMessages,
  getChat,
  getMeet,
  createLog,
} = require("./utils");
const Redis = require("ioredis");
let corsOptions = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: [
    "x-auth-token",
    "set-cookie",
    "authorization",
    "content-type",
    "credentials",
    "cache-control",
  ],
};

const configure_socket = (server) => {
  let io;
  if (process.env.REDIS == "redis") {
    let redisClient = new Redis({
      port: 6379, // Redis port
      host: process.env.REDIS_HOST, // Redis host
      family: 4, // 4 (IPv4) or 6 (IPv6)
      db: 0,
    });
    io = require("socket.io")(server, {
      cors: corsOptions,
      adapter: require("socket.io-redis")({
        pubClient: redisClient,
        subClient: redisClient.duplicate(),
      }),
    });
  } else {
    io = require("socket.io")(server, {
      cors: corsOptions,
    });
  }

  //====================================== IO LISTNERS ========================================================
  io.use(socketAuth);
  io.on("connection", (socket) => {
    if (socket.user) console.log("Websocket connection established..........", socket.user._id);

    //==============================================IO HELPERS ==================================================
    /**
     * Calling user
     * callee receives a incoming call event on fronted
     * @name call_user
     * @param {*} userData userId and meetID
     * on accept callee is redirected to meeting
     */
    const callUser = async ({ userID, meetID }) => {
      console.log("calling user...", userID);
      let user = await User.findById(userID);
      createLog(socket.user._id, "Started a call with  " + user.username);
      io.in(userID).emit("incoming_call", { call_from: socket.user, meetID });
    };

    /**
           * Answer call
              caller will get callaccepted event
            ans both callee and caller are joined in a meet
           * @name answer_call
           * @param {*} data meetID,caller
           */

    const answerCall = async ({ meetID, call_from }) => {
      console.log("Answering the call from ... ", call_from);
      let user = await User.findById(call_from);
      createLog(socket.user._id, "Received call from  " + user.username);
      addParticipants(meetID, socket.user._id);
      io.in(call_from).emit("callaccepted", meetID);
    };

    /**
     * reject call
     * caller will get event called callaborted
     * @name reject_call
     * @param {*} callData userId,meetID
     */
    const rejectCall = async ({ userID, meetID }) => {
      let user = await User.findById(userID);
      createLog(socket.user._id, "Couldn't receive call from " + user.username);
      createLog(userID, "Couldn't complete call with " + socket.user.username);
      console.log("Rejecting the call from ", userID);
      io.in(`${userID}`).emit("callaborted", meetID);
    };

    /**
     * End call
     * caller ends call himself
     * so callee will get event call call_ended
     * @name endcall
     * @param {string} userID
     */
    const endCall = async (userID) => {
      let user = await User.findById(userID);
      createLog(socket.user._id, "Couldn't complete call with " + user.username);
      createLog(userID, "Couldn't complete call with " + socket.user.username);
      io.in(`${userID}`).emit("call_ended");
    };

    /**
     * join Chat
     * join chat room with given room_name
     * @name join_chat
     * @param {*} room_name name of chat room
     */
    const joinChat = async (room_name) => {
      console.log("Joined chat ", room_name);
      socket.join(`${room_name}`);
      const messages = await getMessages(room_name);
      socket.emit("prev_messages", messages);
    };

    /**
     * join Meet
     * Join meet with given meetId
     * and send all meet particiapants back to user
     * @name join_meet
     * @param {*} meetID meetid
     */
    const joinMeet = async (meetID) => {
      console.log("Joined meet ", socket.user.username);
      const meet = await getMeet(meetID);
      socket.join(`${meet.chat}`);
      createLog(socket.user._id, "Joined meet started by " + meet.author.username);
      meet.participants = meet.participants.filter((u) => u._id != socket.user._id);
      socket.emit("users_in_meet", { users: meet.participants, chatID: meet.chat });
      addParticipants(meetID, socket.user._id);
      const messages = await getMessages(meet.chat);
      socket.emit("prev_messages", messages);
    };

    /**
     * New message
     * Broadcast this message to all users in current chat
     * @name new_message
     * @param {*} messageData
     */

    const newMessage = async ({ content, chatID, isMeet, meet, reply_to }) => {
      if (isMeet) {
        meet = await getMeet(meet);
        chatID = meet.chat;
      }
      console.log("Received new message in ", chatID);
      let message = await createNewMessage(content, socket.user, chatID, reply_to);
      if (message) {
        console.log("Sending new message in ", chatID);
        io.in(`${chatID}`).emit("new_message", message);
      }
    };

    /**
     * Send signal
     * send signal of current user stream to payload.user
     * @name return_signal
     * @param {*} payload
     */

    const sendSignal = (payload) => {
      console.log("Sending my signal to", payload.userTosignal);
      io.in(payload.userTosignal).emit("user_joined", {
        signal: payload.signal,
        id: payload.caller,
        user: socket.user,
      });
    };

    /**
     * After receiving signal from another user
     * send signal back to callerID
     * @name return_signal
     * @param {*} payload
     */
    const returnSignal = (payload) => {
      console.log("Getting a return signal");
      io.in(payload.callerID).emit("receive_signal_back", {
        signal: payload.signal,
        id: socket.user._id,
      });
    };

    /**
     *
     * If curr users stream info changes like audio and video
     * broadcast it to all users in meet
     *
     * @name change_media_state
     * @param {*} meetData mediaState,meetID
     */

    const changeMedia = async ({ mediaState, meetID }) => {
      console.log("received change in mediaState", mediaState, meetID);
      const meet = await getMeet(meetID);
      io.to(`${meet.chat}`).emit("change_media_state", { mediaState, peerID: socket.user._id });
    };

    /**
     * Exit Meet
     * leave the socket room and tell all other room members
     * that curr user left the meet
     * @name exit_meet
     * @param {*} meetID
     */
    const exitMeet = async (meetID) => {
      if (meetID) {
        const meet = await getMeet(meetID);
        leaveMeet(meetID, socket.user._id);
        createLog(socket.user._id, "Left meet started by  " + meet.author.username);
        console.log("Leaving meet .....");
        socket.to(`${meet.chat}`).emit("left_meet", socket.user._id);
        socket.leave(`${meet.chat}`);
      }
    };

    /**
     * Group meet
     * Create a goup viedeo call
     * @name create_group_meet
     * @param {*} meetInfo
     */
    const createGroupMeet = async ({ meetID, chatID }) => {
      let chat = await getChat(chatID);
      createLog(socket.user._id, "Started new group meet in " + chat.channel_name);
      let message = await createNewMessage(
        `${socket.user.username} has started a group call`,
        socket.user,
        chatID,
        (meetID = meetID),
        (reply_to = null),
        (is_bot = true)
      );
      if (message) io.in(`${chatID}`).emit("new_message", message);
    };

    /**
     * Disconect
     * on disconned leave all the joined rooms and tell them user has left the meet
     * @name disconnect_socket
     *
     */

    const disconnect = () => {
      var rooms = io.sockets.adapter.sids[socket.id];
      for (var room in rooms) {
        socket.to(`${room}`).emit("left_meet", socket.user._id);
        socket.leave(room);
      }
    };

    //@property we are adding each user to a seprate room on connection ,which is equal to his userid
    //this way we can send message to any user if he is connected

    if (socket.user) socket.join(`${socket.user._id}`);

    socket.on("join_chat", joinChat);

    //============================  CREATE CALL ==================================
    socket.on("calluser", callUser);

    socket.on("answercall", answerCall);

    socket.on("rejectcall", rejectCall);

    socket.on("end_call", endCall);
    //=================================== VIDEO CHAT ===============================

    socket.on("join_meet", joinMeet);

    socket.on("send_signal", sendSignal);

    socket.on("return_signal", returnSignal);

    socket.on("change_media_state", changeMedia);

    socket.on("leave_meet", exitMeet);

    socket.on("new_message", newMessage);

    socket.on("create_group_meet", createGroupMeet);

    socket.on("disconnect", disconnect);
  });

  return io;
};

module.exports = configure_socket;
