const { Chat, Meet } = require("../models");

const createChat = async (req, res) => {
  try {
    let chat = await Chat.create({ participants: [req.user._id, req.body.user._id] });
    return res.send(chat);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

const createMeet = async (req, res) => {
  try {
    let meet = await Meet({ author: req.user });
    let chat = await Chat.create({
      participants: [req.user._id, req.body.user._id],
      meet: meet,
      in_meet_chat: true,
    });
    meet.chat = chat;
    await meet.save();
    res.send(meet);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};
module.exports = {
  createChat,
  createMeet,
};
