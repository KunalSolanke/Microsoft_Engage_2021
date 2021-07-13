const { Message, Chat, Activity } = require("./models");
const Meet = require("./models/Meet");

const getMeet = async (meetID) => {
  try {
    let meet = await Meet.findById(meetID)
      .populate("participants", "-refreshToken")
      .populate("author", "-refreshTokens")
      .exec();
    return meet;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getChat = async (chatID) => {
  try {
    let chat = await Chat.findById(chatID);
    return chat;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getMessages = async (chatID) => {
  try {
    let messages = await Message.find({ chat: chatID })
      .limit(20)
      .populate("author", "-refreshTokens")
      .populate("reply_to", "-refreshTokens")
      .exec();
    return messages;
  } catch (err) {
    console.log(err);
    return [];
  }
};
const createNewMessage = async (
  content,
  user,
  room_name,
  meetID = null,
  reply_to = null,
  is_bot = false
) => {
  try {
    const chat = await Chat.findById(room_name);
    let msgData = {
      content: content,
      author: user._id,
      content_type: "text",
      chat: chat._id,
      is_bot,
      meet: meetID,
    };
    if (reply_to) msgData = { ...msgData, reply_to };
    let message = await Message.create(msgData);
    chat.messages.concat(message);
    message.author = user;
    if (reply_to) message.reply_to = await User.findById(reply_to);
    return message;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const addParticipants = async (meetID, userID) => {
  try {
    let meet = await Meet.findById(meetID);
    if (!meet.participants.includes(userID)) {
      meet.participants.push(userID);
      meet.save();
    }
    let chat = await Chat.findById(meet.chat);
    if (chat) {
      if (chat.is_group) {
        chat = await Chat.findOne({ channels: chat._id });
        if (!chat.participants.includes(userID)) {
          chat.participants.push(userID);
          chat.is_group = true;
          chat.save();
        }
      } else {
        if (!chat.participants.includes(userID)) {
          chat.participants.push(userID);
          chat.is_meet_group = true;
          chat.save();
        }
      }
    }
  } catch (err) {}
};

const leaveMeet = async (meetID, userID) => {
  let meet;
  console.log("User leaving meet", userID);
  try {
    meet = await Meet.findById(meetID);
    if (meet.participants.includes(`${userID}`)) {
      meet.participants = meet.participants.filter((id) => id != `${userID}`);
      await meet.save();
    }
  } catch (err) {}
};

const createLog = async (userID, log) => {
  try {
    myLogTable = await Activity.create({ user: userID, log });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  leaveMeet,
  addParticipants,
  createNewMessage,
  getMessages,
  getChat,
  getMeet,
  createLog,
};
