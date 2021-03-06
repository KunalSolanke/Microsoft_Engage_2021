const { User } = require("../models");
const jwt = require("jsonwebtoken");
/**
 * Socket js auth middleware
 * @name socketAuth
 * @function
 * @inner
 *
 */
const auth = async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    let data = null;
    try {
      data = await jwt.verify(token, process.env.JWT_REFRESH_KEY);
    } catch (err) {
      return next(new Error("token expired"));
    }
    const user = await User.findById(data._id);
    socket.user = user;
  } else {
    socket.user = null;
  }
  next();
};

module.exports = auth;
