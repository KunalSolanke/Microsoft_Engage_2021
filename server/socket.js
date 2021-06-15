const socketAuth = require("./middlewares/socketAuth");
const { Message, Chat } = require("./models");

const createNewMessage = async (content, user, room_name) => {
  let message = await Message.create({ content: content, author: user._id, content: "text" });
  const chat = await Chat.findById(room_name);
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

  // io.use(socketAuth);
  io.on("connection", (socket) => {
    socket.on("join_chat", ({ room_name }) => {
      socket.join(room_name);
    });

    socket.on("newMessage", ({ message, room_name }) => {
      createNewMessage(message, socket.user, room_name);
    });

    socket.on("disconnect", () => {});
  });
};
module.exports = configure_socket;
