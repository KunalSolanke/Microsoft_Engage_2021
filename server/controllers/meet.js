const { Chat, Meet } = require("../models");

const createChat = async (req, res) => {
  try {
    console.log(req.body);
    let chat = await Chat.findOne({
      participants: [req.user._id, req.body.userID],
      is_group: false,
      is_meet_chat: false,
    })
      .populate("messages")
      .exec();

    if (!chat) chat = await Chat.create({ participants: [req.user._id, req.body.userID] });

    return res.send(chat);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

const createMeet = async (req, res) => {
  console.log(req.body);
  try {
    let meet = await Meet({ author: req.user });
    let chat = await Chat.create({
      participants: [req.user._id, req.body.user._id],
      meet: meet,
      is_meet_chat: true,
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
