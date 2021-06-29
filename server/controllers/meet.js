const { Chat, Meet, Message } = require("../models");

const createChat = async (req, res) => {
  try {
    let chat = await Chat.findOne({
      participants: [req.user._id, req.body.userID],
      is_channel: false,
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
  try {
    let meet = await Meet({ author: req.user, is_group: req.body.is_group });
    let chat = await Chat.create({
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

const createTeam = async (req, res) => {
  let { description, channel_name, users } = req.body;
  try {
    users.push(req.user._id);
    let team = await Chat.create({
      is_group: true,
      participants: users,
      channel_name,
      description,
      created_by: req.user._id,
    });
    let generalChannel = await Chat.create({
      is_channel: true,
      channel_name: "general",
      created_by: req.user._id,
      description: "This is the general channel",
    });
    team.channels.push(generalChannel);
    await team.save();
    res.send(team);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

const getChat = async (req, res) => {
  try {
    let chat = await Chat.findById(req.params.chatID).populate("participants");
    chat.participants = chat.participants.filter((p) => p._id != req.user._id);
    res.send({
      ...chat,
      user: chat.participants[0] || null,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

const getTeam = async (req, res) => {
  try {
    let team = await Chat.findById(req.params.teamID).populate("participants").populate("channels");
    res.send(team);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

const createChannel = async (req, res) => {
  try {
    let channel = await Chat.create({
      ...req.body,
      is_channel: true,
    });
    let team = await Chat.findById(req.body.team);
    team.channels.push(channel._id);
    await team.save();
    return res.send(channel);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};
const getChannel = async (req, res) => {
  try {
    let team = await Chat.findOne({ channels: req.params.channelID }).lean().populate("channels");
    res.send({
      channel: team.channels.filter((c) => c._id == req.params.channelID)[0],
      team: team,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};
const joinTeam = async (req, res) => {
  try {
    let team = await Chat.findById(req.params.teamID);
    team.participants.push(req.user._id);
    team.save();
    res.send(team);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

module.exports = {
  createChat,
  createMeet,
  getChat,
  getTeam,
  createTeam,
  getChannel,
  joinTeam,
  createChannel,
};
