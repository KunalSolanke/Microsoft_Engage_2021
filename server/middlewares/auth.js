const { User } = require("../models");
const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  const token = req.get("Authorization")
    ? req.get("Authorization").split(" ")[1]
    : null;
  console.log(token);
  if (token) {
    let data = null;
    try {
      data = await jwt.verify(token, process.env.JWT_REFRESH_KEY);
    } catch (err) {
      res.send(400).error("Please refresh the browser");
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
