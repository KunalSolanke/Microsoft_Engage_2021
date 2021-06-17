const socketAuth = require("./middlewares/socketAuth");
const { Message, Chat } = require("./models");

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
    console.log("rooms: ", io.sockets.adapter.rooms);
    socket.join(`${socket.user._id}`, (err) => console.log(err));
    socket.on("join_chat", ({ room_name }) => {
      socket.join(room_name);
      socket.emit("prev_messages", { messages: [] });
    });
    //============================  CREATE CALL ==================================
    socket.on("calluser", ({ user, meet }) => {
      console.log("calling user...", user._id);
      io.in(user._id).emit("incoming_call", { call_from: socket.user, meet });
    });

    socket.on("answercall", ({ meet, call_from }) => {
      io.in(call_from._id).emit("callaccepted", { meet });
    });

    socket.on("rejectcall", ({ user, meet }) => {
      io.in(user._id).emit("callaborted", { meet });
    });
    //=================================== VIDEO CHAT ===============================

    socket.on("join_meet", ({ meet }) => {
      socket.join(meet.chat);
      socket.emit("users_in_meet", meet.paticipants);
      addParticipants(meet);
      socket.to(meet.chat).emit("new_user_joined", { user, meet });
    });

    socket.on("send_signal", (payload) => {
      io.in(payload.userTosignal).emit("user_joined", {
        signal: payload.signal,
        id: payload.caller._id,
      });
    });

    socket.on("return_signal", (payload) => {
      io.in(payload.callerID).emit("receive_signal_back", {
        signal: payload.signal,
        id: socket.user._id,
      });
    });

    socket.on("new_message", ({ message, room_name }) => {
      createNewMessage(message, socket.user, room_name);
      socket.broadcast.to(room_name).emit("new_message", { message, roomname });
    });

    socket.on("disconnect", () => {
      socket.leave(socket.user._id);
    });
  });
};
module.exports = configure_socket;
