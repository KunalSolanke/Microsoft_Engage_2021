var express = require("express");
var router = express.Router();
const { generateToken, sendToken } = require("../utils/tokens");
const passport = require("../middlewares/social-strategies");
const FormData = require("form-data");
const fetch = require("node-fetch");

router.route("/google").post(
  passport.authenticate("google-token", { session: false }),

  function (req, res, next) {
    if (!req.user) {
      return res.status(400).send("User Not Authenticated");
    }
    req.auth = {
      id: req.user.id,
    };

    next();
  },
  generateToken,
  sendToken
);

router.route("/github").post(
  async (req, res, next) => {
    const { code } = req.body;

    const data = {};
    data["client_id"] = process.env.GITHUB_CLIENT_ID;
    data["client_secret"] = process.env.GITHUB_CLIENT_SECRET;
    data["code"] = code;
    data["redirect_uri"] = "";
    try {
      // Request to exchange code for an access token
      const res = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      let paramsString = await res.text();
      let params = new URLSearchParams(paramsString);
      const access_token = params.get("access_token");
      req.body.access_token = access_token;
      next();
    } catch (err) {
      console.log(err);
      res.status(400).send(err.message);
    }
  },
  passport.authenticate("github-token", { session: false }),
  function (req, res, next) {
    if (!req.user) {
      return res.status(400).send("User Not Authenticated");
    }
    req.auth = {
      id: req.user.id,
    };

    next();
  },
  generateToken,
  sendToken
);

router.route("/microsoft").post(
  passport.authenticate("oauth-bearer", { session: false }),
  function (req, res, next) {
    if (!req.user) {
      return res.status(400).send("User Not Authenticated");
    }
    req.auth = {
      id: req.user.id,
    };

    next();
  },
  generateToken,
  sendToken
);

module.exports = router;
