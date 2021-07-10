const User = require("../models/User");

/**
 * Route serving find Users
 * Find users by keyword
 * return users array
 * @name meet/chat/get
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
const findUsers = async (req, res) => {
  const { search } = req.query;
  console.log(search);

  try {
    let regex = new RegExp(search, "i");
    let users = await User.find({
      $or: [
        { username: { $regex: regex } },
        { fullName: { $regex: regex } },
        { email: { $regex: regex } },
      ],
    });

    res.status(200).send(users);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = {
  findUsers,
};
