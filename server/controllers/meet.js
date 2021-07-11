const { Chat, Meet, Message, User } = require("../models");
const { createLog } = require("../utils");

/**
 * Route serving chat
 * Create new chat between two users
 * return chat
 * @name addContact
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
const createChat = async (req, res) => {
  try {
    let chat = await Chat.findOne({
      $and: [
        { participants: req.user._id },
        { participants: req.body.userID },
        { participants: { $size: 2 } },
      ],
      is_channel: false,
      is_group: false,
      is_meet_chat: false,
    })
      .populate("messages")
      .exec();
    let user = await User.findById(req.body.userID);
    createLog(req.user._id, "Started conversation with " + user.username);
    if (!chat) chat = await Chat.create({ participants: [req.user._id, req.body.userID] });

    return res.send(chat);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

/**
 * Route serving create meet
 * Create new meet
 * return meet
 * @name createMeeting
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
const createMeet = async (req, res) => {
  try {
    let meet = await Meet({ author: req.user, is_group: req.body.is_group });
    let chatID = req.body.chatID;

    if (!req.body.chatID) {
      let chat = await Chat.findOne({
        $and: [
          { participants: req.user._id },
          { participants: req.body.userID },
          { participants: { $size: 2 } },
        ],
        is_channel: false,
        is_group: false,
        is_meet_chat: false,
      });
      if (!chat)
        chat = await Chat.create({
          particpants: [req.user._id, req.body.userID],
        });
      chatID = chat._id;
    }

    meet.chat = chatID;
    await meet.save();
    res.send(meet);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

/**
 * Route serving team
 * Create new team
 * return chat
 * @name createTeam
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */

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
      channel_name: "General",
      created_by: req.user._id,
      description: "This is the general channel",
    });
    createLog(req.user._id, "Created new team " + team.channel_name);
    team.channels.push(generalChannel._id);
    await team.save();
    res.send(team);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

/**
 * Route serving get chat
 * get chat by chatID
 * return chat
 * @name getChat
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
const getChat = async (req, res) => {
  try {
    let chat = await Chat.findById(req.params.chatID)
      .lean()
      .populate("participants", "-refreshTokens");
    res.send({
      ...chat,
      user: chat.participants.filter((p) => `${p._id}` != `${req.user._id}`)[0] || null,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

/**
 * Route serving get team
 * Get team by ID
 * return team
 * @name getTeam
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @swagger
 */
const getTeam = async (req, res) => {
  try {
    let team = await Chat.findById(req.params.teamID)
      .lean()
      .populate("participants", "-refreshTokens")
      .populate("channels");
    res.send(team);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

/**
 * Route serving create new channel in teams
 * Create new channel in teams
 * return channel obj
 * @name createChannel
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
const createChannel = async (req, res) => {
  try {
    let channel = await Chat.create({
      ...req.body,
      is_channel: true,
    });
    let team = await Chat.findById(req.body.team);
    createLog(req.user._id, "Created new channel " + channel.channel_name);
    team.channels.push(channel._id);
    await team.save();
    return res.send(channel);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

/**
 * Route serving get channel
 * Get channel by id
 * return channel
 * @name getChannel
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */

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
/**
 * Route serving join team
 * @name joinTeams
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
const joinTeam = async (req, res) => {
  try {
    let team = await Chat.findById(req.params.teamID).lean();
    team.participants.push(req.user._id);
    createLog(req.user._id, "Joined team " + team.team_name);
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
