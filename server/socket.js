const socketAuth = require("./middlewares/socketAuth");
const { Message, Chat } = require("./models");
const Meet = require("./models/Meet");

const configure_socket = (server) => {
  const io = require("socket.io")(server, {
    cors: {
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
    },
  });

  io.use(socketAuth);
  io.on("connection", (socket) => {
    console.log("Websocket connection established..........", socket.user._id);

    //@property we are adding each user to a seprate room on connection ,which is equal to his userid
    //this way we can send message to any user if he is connected

    socket.join(`${socket.user._id}`, (err) => console.log(err));

    socket.on("join_chat", (room_name) => {
      socket.join(room_name);
      socket.emit("prev_messages", { messages: [] });
    });

    socket.on("leave_chat", (chatID) => {
      socket.leave(chatID);
      socket.to(chatID).emit("left_chat", socket.user._id);
    });
    //============================  CREATE CALL ==================================
    socket.on("calluser", ({ userID, meetID }) => {
      console.log("calling user...", userID);
      io.in(userID).emit("incoming_call", { call_from: socket.user, meetID });
    });

    socket.on("answercall", ({ meetID, call_from }) => {
      console.log("Answering the call from ... ", call_from);
      addParticipants(meetID, socket.user._id);
      io.in(call_from).emit("callaccepted", meetID);
    });

    socket.on("rejectcall", ({ userID, meetID }) => {
      console.log("Rejecting the call from ", userID);
      io.in(`${userID}`).emit("callaborted", meetID);
    });
    //=================================== VIDEO CHAT ===============================

    socket.on("join_meet", async (meetID) => {
      console.log("Joining meet .........", meetID);
      const meet = await getMeet(meetID);
      socket.join(`${meet.chat}`);
      console.log("rooms: ", io.sockets.adapter.rooms);
      socket.emit("users_in_meet", meet.participants);
      addParticipants(meetID, socket.user._id);
      socket.emit("prev_messages", getMessages(meet.chat));
    });

    socket.on("send_signal", (payload) => {
      console.log("Sending my signal ..", payload.userTosignal);
      io.in(payload.userTosignal).emit("user_joined", {
        signal: payload.signal,
        id: payload.caller,
      });
    });

    socket.on("return_signal", (payload) => {
      console.log("Getting signal from ", payload);
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
      console.log("Leaving rooms: ", io.sockets.adapter.rooms);
      console.log("Leavnig meet....", meetID);
      if (meetID) {
        const meet = await getMeet(meetID);
        leaveMeet(meetID, socket.user._id);
        console.log("Leaving meet .....", meet);
        socket.to(`${meet.chat}`).emit("left_chat", socket.user._id);
        socket.leave(`${meet.chat}`);
      }
    });

    socket.on("new_message", ({ content, chatID }) => {
      createNewMessage(message, socket.user, chatID);
      socket.broadcast.to(room_name).emit("new_message", message);
    });

    socket.on("disconnect", () => {
      var rooms = io.sockets.adapter.sids[socket.id];
      for (var room in rooms) {
        socket.leave(room);
      }
    });
  });
};

const getMeet = async (meetID) => {
  try {
    let meet = await Meet.findById(meetID);
    return meet;
  } catch (err) {
    console.log(err);
    return null;
  }
};
const getChat = async (chatID) => {
  try {
    let chat = await Chat.findById(meetID);
    return chat;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getMessages = async (chatID) => {
  try {
    let messages = await Message.find({ chat: chatID }).limit(20);
    return messages;
  } catch (err) {
    console.log(err);
    return [];
  }
};
const createNewMessage = async (content, user, room_name) => {
  const chat = await Chat.findById(room_name);
  let message = await Message.create({
    content: content,
    author: user._id,
    content: "text",
    chat: chat,
  });
  chat.messages.concat(message);
  await chat.save();
};

const addParticipants = async (meetID, userID) => {
  try {
    let meet = await Meet.findById(meetID);
    if (!meet.participants.includes(userID)) {
      meet.participants.push(userID);
      meet.save();
    }
    console.log("New participant", meet);
  } catch (err) {}
};

const leaveMeet = async (meetID, userID) => {
  let meet;
  console.log("User leaving meet", userID);
  try {
    meet = await Meet.findById(meetID);
    if (meet.participants.includes(`${userID}`)) {
      console.log("Leaving ");
      meet.participants = meet.participants.filter((id) => id != `${userID}`);
      meet.save();
    }
  } catch (err) {}
  console.log("Meet after leaving ", meet);
};

module.exports = configure_socket;
