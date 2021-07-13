const User = require("../models/User");
const Activity = require("../models/Activity");
const { setResToken } = require("../utils/tokens");

/**
 * Route serving signup
 * Return userdata and tokens
 * @name Register
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 *
 */
const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let oldUser = await User.findOne({ email });
    if (oldUser) {
      throw new Error("User with email already exists");
    }
    const user = await User.create({
      username: username,
      email: email,
    });
    user.password = password;
    await user.save();
    let accessToken = await user.generateAuthToken("3d");
    let refreshToken = await user.generateAuthToken("15d");
    user.refreshTokens = user.refreshTokens.concat([refreshToken]);
    await user.save();
    res.setHeader("Cache-control", "private");
    setResToken(res, refreshToken);
    await Activity.create({ user: user._id, log: "Joined Connect" });
    res.status(200).send({
      token: accessToken,
      username: user.username || user.fullName || user.email,
      email: user.email,
      expiry: 3600,
      userID: user._id,
    });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send("Validation error.Please enter proper/new email");
  }
};

/**
 * Route serving slogin
 * Return userdata and tokens
 * @name Login
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    let accessToken = await user.generateAuthToken("3d");
    let refreshToken = await user.generateAuthToken("15d");
    user.refreshTokens = user.refreshTokens.concat([refreshToken]);
    await user.save();
    res.setHeader("Cache-control", "private");
    setResToken(res, refreshToken);
    res.status(200).send({
      token: accessToken,
      username: user.username || user.fullName || user.email,
      email: user.email,
      userID: user._id,
      expiry: 3600,
    });
  } catch (err) {
    console.log(err);
    res.status(400);
    res.send("Please check the credentials");
  }
};

/**
 * Route serving refresh
 * Refersh tokens
 * @name RefreshToken
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
const refresh = async (req, res) => {
  try {
    let token = req.cookies["refresh_token"];
    let user = await User.findByRefreshToken(token);
    if (user) {
      user.refreshTokens = user.refreshTokens.filter((t) => t != token);
      await user.save();
      let accessToken = await user.generateAuthToken("3d");
      let refreshToken = await user.generateAuthToken("15d");
      res.setHeader("Cache-control", "private");
      setResToken(res, refreshToken);
      user.refreshTokens = user.refreshTokens.concat([refreshToken]);
      await user.save();
      res.status(200).send({
        token: accessToken,
        expiry: 3600,
        username: user.username || user.fullName || user.email,
        email: user.email,
        userID: user._id,
      });
    } else {
      throw new Error("user not found");
    }
  } catch (err) {
    console.log(err);
    res.clearCookie("refresh_token");
    res.status(400);
    res.send("Refresh session failed,please login");
  }
};

/**
 * Route serving logout
 * Return userdata and tokens
 * @name Logout
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
const logout = async (req, res) => {
  let cookieOpts = {
    httpOnly: true,
    secure: true,
  };
  res.clearCookie("refresh_token", cookieOpts);
  let user = req.user;
  user.refreshTokens = user.refreshTokens.filter((t) => t != req.token);
  await user.save();
  res.status(200).send("User logged out");
};

module.exports = {
  signup,
  login,
  logout,
  refresh,
};
