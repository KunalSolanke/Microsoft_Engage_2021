const setResToken = (res, token) => {
  let maxAge = 7 * 24 * 60 * 60 * 1000;
  let expiresDate = new Date();
  expiresDate.setDate(expiresDate.getDate() + 7);
  res.setHeader("set-cookie", [
    "refresh_token=" +
      token +
      "; Max-Age=" +
      +maxAge +
      "; Path=/; Expires=" +
      expiresDate.toUTCString() +
      "; Secure; SameSite=None; HttpOnly",
  ]);
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
