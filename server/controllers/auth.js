const User = require("../models/User");

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);
  try {
    const user = await new User({
      username: username,
      email: email,
      password: password,
    });
    await user.save();
    let accessToken = await user.generateAuthToken("1h");
    let refreshToken = await user.generateAuthToken("7d");
    user.refreshTokens = user.refreshTokens.concat([refreshToken]);
    await user.save();
    res.setHeader("Cache-control", "private");
    setResToken(res, refreshToken);
    await Activity.create({ user: user._id });
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
    res.send(err.message);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("email,passowrd on server are...", email, password);
  try {
    const user = await User.findByCredentials(email, password);
    let accessToken = await user.generateAuthToken("1h");
    let refreshToken = await user.generateAuthToken("7d");
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
    res.send(err.message);
  }
};

const refresh = async (req, res) => {
  try {
    let token = req.cookies["refresh_token"];
    let user = await User.findByRefreshToken(token);
    if (user) {
      user.refreshTokens = user.refreshTokens.filter((t) => t != token);
      await user.save();
      let accessToken = await user.generateAuthToken("1h");
      let refreshToken = await user.generateAuthToken("7d");
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
    res.send("failed");
  }
};

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
