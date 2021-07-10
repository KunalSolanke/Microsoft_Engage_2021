const Chat = require("../models/Chat");
const User = require("../models/User");
const Activity = require("../models/Activity");

/**
 * Route serving get user profile
 * get users profile
 * @name accounts/profile
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    user.refreshTokens = [];
    res.status(200).send(user);
  } catch (err) {
    console.log(err.message);
    res.status(401).send(err.message);
  }
};

/**
 * Route serving update user profile
 * with all fields in user model
 * get users profile
 * @name accounts/profile/update
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */

const updateProfile = async (req, res) => {
  try {
    let user = req.user;
    await User.findByIdAndUpdate(user._id, req.body);
    if (req.file) {
      user.image = req.file.url;
      await user.save();
    }
    user = await User.findById(user._id);
    user.refreshToken = [];
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(401).send(err.message);
  }
};

/**
 * Route serving get my contacts from
 * get users contacts
 * return populated chat with user profiles
 * @name accounts/profile
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */

const getMyContacts = async (req, res) => {
  try {
    let contacts = await Chat.find({
      participants: req.user._id,
      is_group: false,
      is_meet_chat: false,
      is_channel: false,
    })
      .lean()
      .populate("participants", "-refreshTokens")
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

/**
 * Route serving get my teams
 * return all the team I am participant in
 * @name accounts/profile
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
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

/**
 * retrun the last day of moth helper
 * @param {*} month
 * @param {*} year
 */
const getLastDay = function (month, year) {
  return new Date(year, month + 1, 0);
};

/**
 * Route serving get my activity
 * returns all the feed of user ,
 * based on month if provided
 * @name accounts/profile
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
const getMyLogs = async (req, res) => {
  try {
    let myLogTable;
    if (req.body.start_month) {
      let date = new Date(req.body.start_month);
      let last_date = getLastDay(date.getMonth() + 1, date.getFullYear());
      console.log(date, last_date);
      myLogTable = await Activity.find({
        user: req.user._id,
        created_at: {
          $gte: date.toISOString(),
          $lte: last_date.toISOString(),
        },
      });
    } else {
      myLogTable = await Activity.find({ user: req.user._id }).sort({ created_at: 1 });
    }
    res.send(myLogTable);
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
  getMyLogs,
};
