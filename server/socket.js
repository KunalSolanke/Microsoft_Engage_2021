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
  if ((process.env.REDIS = "redis")) {
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

  io.use(socketAuth);
  io.on("connection", (socket) => {
    console.log("Websocket connection established..........", socket.user._id);

    //@property we are adding each user to a seprate room on connection ,which is equal to his userid
    //this way we can send message to any user if he is connected

    socket.join(`${socket.user._id}`);

    socket.on("join_chat", async (room_name) => {
      socket.join(`${room_name}`);
      const messages = await getMessages(room_name);
      socket.emit("prev_messages", messages);
    });

    //============================  CREATE CALL ==================================
    socket.on("calluser", async ({ userID, meetID }) => {
      console.log("calling user...", userID);
      let user = await User.findById(userID);
      createLog(socket.user._id, "Started a call with  " + user.username);
      io.in(userID).emit("incoming_call", { call_from: socket.user, meetID });
    });

    socket.on("answercall", async ({ meetID, call_from }) => {
      console.log("Answering the call from ... ", call_from);
      let user = await User.findById(call_from);
      createLog(socket.user._id, "Received call from  " + user.username);
      addParticipants(meetID, socket.user._id);
      io.in(call_from).emit("callaccepted", meetID);
    });

    socket.on("rejectcall", async ({ userID, meetID }) => {
      let user = await User.findById(userID);
      createLog(socket.user._id, "Couldn't receive call from " + user.username);
      createLog(userID, "Couldn't complete call with " + socket.user.username);
      console.log("Rejecting the call from ", userID);
      io.in(`${userID}`).emit("callaborted", meetID);
    });

    socket.on("end_call", async (userID) => {
      let user = await User.findById(userID);
      createLog(socket.user._id, "Couldn't complete call with " + user.username);
      createLog(userID, "Couldn't complete call with " + socket.user.username);
      io.in(`${userID}`).emit("call_ended");
    });
    //=================================== VIDEO CHAT ===============================

    socket.on("join_meet", async (meetID) => {
      console.log("Joined meet ", socket.user.username);
      const meet = await getMeet(meetID);
      socket.join(`${meet.chat}`);
      createLog(socket.user._id, "Joined meet started by " + meet.author.username);
      meet.participants = meet.participants.filter((u) => u._id != socket.user._id);
      socket.emit("users_in_meet", { users: meet.participants, chatID: meet.chat });
      addParticipants(meetID, socket.user._id);
      const messages = await getMessages(meet.chat);
      socket.emit("prev_messages", messages);
    });

    socket.on("send_signal", (payload) => {
      console.log("Sending my signal to", payload.userTosignal);
      io.in(payload.userTosignal).emit("user_joined", {
        signal: payload.signal,
        id: payload.caller,
        user: socket.user,
      });
    });

    socket.on("return_signal", (payload) => {
      console.log("Getting a return signal");
      io.in(payload.callerID).emit("receive_signal_back", {
        signal: payload.signal,
        id: socket.user._id,
      });
    });

    socket.on("pause_video", async ({ userID, meetID }) => {
      const meet = await getMeet(meetID);
      socket.to(meet.chat).emit("paused_video", { userId, meet });
    });

    socket.on("mute_audio", async ({ userId, meetID }) => {
      const meet = await getMeet(meetID);
      io.to(meet.chat).emit("muted_audio", { userId, meet });
    });

    socket.on("leave_meet", async (meetID) => {
      // console.log("Leaving rooms: ", io.sockets.adapter.rooms);
      // console.log("Leavnig meet....", meetID);
      if (meetID) {
        const meet = await getMeet(meetID);
        leaveMeet(meetID, socket.user._id);
        createLog(socket.user._id, "Left meet started by  " + meet.author.username);
        console.log("Leaving meet .....", meet);
        socket.to(`${meet.chat}`).emit("left_meet", socket.user._id);
        socket.leave(`${meet.chat}`);
      }
    });

    socket.on("new_message", async ({ content, chatID, isMeet, meet, reply_to }) => {
      if (isMeet) {
        meet = await getMeet(meet);
        chatID = meet.chat;
      }
      let message = await createNewMessage(content, socket.user, chatID, reply_to);
      if (message) io.in(`${chatID}`).emit("new_message", message);
    });

    socket.on("create_group_meet", async ({ meetID, chatID }) => {
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
    });

    socket.on("disconnect", () => {
      var rooms = io.sockets.adapter.sids[socket.id];
      for (var room in rooms) {
        socket.leave(room);
      }
    });
  });

  return io;
};

module.exports = configure_socket;
