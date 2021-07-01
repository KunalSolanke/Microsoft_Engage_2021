const { Message, Chat, Activity } = require("./models");
const Meet = require("./models/Meet");

const getMeet = async (meetID) => {
  try {
    let meet = await Meet.findById(meetID).populate("participants").populate("author").exec();
    return meet;
  } catch (err) {
    //console.log(err);
    return null;
  }
};

const getChat = async (chatID) => {
  try {
    let chat = await Chat.findById(chatID);
    return chat;
  } catch (err) {
    //console.log(err);
    return null;
  }
};

const getMessages = async (chatID) => {
  try {
    let messages = await Message.find({ chat: chatID })
      .limit(20)
      .populate("author")
      .populate("reply_to")
      .exec();
    return messages;
  } catch (err) {
    //console.log(err);
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
    //console.log(err);
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
    //console.log("New participant", meet);
  } catch (err) {}
};

const leaveMeet = async (meetID, userID) => {
  let meet;
  //console.log("User leaving meet", userID);
  try {
    meet = await Meet.findById(meetID);
    if (meet.participants.includes(`${userID}`)) {
      //console.log("Leaving ");
      meet.participants = meet.participants.filter((id) => id != `${userID}`);
      meet.save();
    }
  } catch (err) {}
  //console.log("Meet after leaving ", meet);
};

const createLog = async (userID, log) => {
  try {
    let myLogTable = await Activity.findOne({ user: userID });
    if (!myLogTable) myLogTable = await Activity.create({ user: userID });
    myLogTable.logs.push(log);
    await myLogTable.save();
  } catch (err) {
    //console.log(err);
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
