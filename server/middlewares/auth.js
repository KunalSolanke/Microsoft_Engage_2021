const { User } = require("../models");
const jwt = require("jsonwebtoken");
/**
 * Auth middleware
 * associate user to request
 * @name accounts/auth/middleware
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 *
 */
const auth = async (req, res, next) => {
  const token = req.get("Authorization") ? req.get("Authorization").split(" ")[1] : null;
  if (token) {
    let data = null;
    try {
      data = await jwt.verify(token, process.env.JWT_REFRESH_KEY);
    } catch (err) {
      res.status(400).send("Please refresh the browser");
      return;
    }
    const user = await User.findById(data._id);
    res.locals.user = user;
    req.user = user;
    req.token = token;
  } else {
    res.locals.user = null;
  }
  next();
};

module.exports = auth;
