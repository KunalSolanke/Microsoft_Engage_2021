const Chat = require("../models/Chat");
const User = require("../models/User");

const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (err) {
    console.log(err.message);
    res.status(401).send(err.message);
  }
};

const updateProfile = async (req, res) => {
  const token = req.get("Authorization").split(" ")[1];
  console.log("token is ", token);
  try {
    let user = req.user;
    await User.findByIdAndUpdate(user._id, req.body);
    if (req.file) {
      user.image = {
        contentType: req.file.url,
      };
      await user.save();
    }
    user = await User.findById(user._id);
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(401).send(err.message);
  }
};

const getMyContacts = async (req, res) => {
  try {
    let contacts = await Chat.find({
      participants: req.user._id,
      is_group: false,
      is_meet_chat: false,
      is_channel: false,
    })
      .lean()
      .populate("participants")
      .populate("messages")
      .exec();
    contacts = contacts.map((c) => ({
      last_message: c.messages.length > 0 ? c.messages[chat.messages.length - 1] : null,
      chat: (({ messages, ...o }) => o)(c),
    }));
    res.send(contacts);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

const getMyTeams = async (req, res) => {
  try {
    let teams = await Chat.find({
      participants: req.user._id,
      is_group: true,
    }).exec();
    res.send(teams);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getMyContacts,
  getMyTeams,
};
