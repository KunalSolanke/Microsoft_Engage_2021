const setResToken = (res, token) => {
  let maxAge = 7 * 24 * 60 * 60 * 1000;
  let cookieOpts = {
    maxAge,
    secure: true,
    sameSite: "none",
    httpOnly: true,
  };
  res.cookie("refresh_token", token, cookieOpts);
};
module.exports = {
  setResToken,
  generateToken: async function (req, res, next) {
    let user = req.user;
    req.accessToken = await user.generateAuthToken("1h");
    req.refreshToken = await user.generateAuthToken("7d");

    return next();
  },
  sendToken: async function (req, res) {
    let user = req.user;
    res.setHeader("Cache-control", "private");
    setResToken(res, req.refreshToken);
    user.refreshTokens = user.refreshTokens.concat([req.refreshToken]);
    await user.save();
    return res.status(200).send({
      token: req.accessToken,
      username: user.username || user.fullName || user.email,
      email: user.email,
      expiry: 3600,
    });
  },
};
