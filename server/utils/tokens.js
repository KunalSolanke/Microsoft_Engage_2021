/**
 * Set resfresh token while sending back response
 * @param {*} res
 * @param {*} token
 */
const setResToken = (res, token) => {
  let maxAge = 7 * 24 * 60 * 60 * 1000;
  let cookieOpts = {
    maxAge,
    httpOnly: true,
  };
  if (process.env.NODE_ENV == "production") {
    cookieOpts = {
      secure: true,
      sameSite: "none",
      ...cookieOpts,
    };
  }
  res.cookie("refresh_token", token, cookieOpts);
};
module.exports = {
  setResToken,
  /**
   * generate refresh token and attach to request object
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  generateToken: async function (req, res, next) {
    let user = req.user;
    req.accessToken = await user.generateAuthToken("1h");
    req.refreshToken = await user.generateAuthToken("7d");

    return next();
  },
  /**
   * send the refresh token with response
   * @param {*} req
   * @param {*} res
   */
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
      userID: user._id,
      expiry: 3600,
    });
  },
};
