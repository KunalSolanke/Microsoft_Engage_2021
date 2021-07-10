const AzureAdOAuth2Strategy = require("passport-azure-ad").BearerStrategy;
var GoogleTokenStrategy = require("passport-google-token").Strategy;
var GitHubTokenStrategy = require("passport-github-token");
const User = require("../models/User");
const passport = require("passport");

/**
 * github social strategy
 * helps setup github auth
 * @name social/github
 * @inner
 *
 */
let githubStrategy = new GitHubTokenStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    passReqToCallback: true,
  },
  function (req, accessToken, refreshToken, profile, done) {
    User.upsertGithubUser(accessToken, refreshToken, profile, function (err, user) {
      return done(err, user);
    });
  }
);

/**
 * azure social strategy
 * helps setup azure outlook auth
 * @name social/azure
 * @inner
 */
let azureStrategy = new AzureAdOAuth2Strategy(
  {
    clientID: process.env.AZURE_AD_CLIENT_ID,
    validateIssuer: true,
    passReqToCallback: false,
    loggingLevel: "error",
    //loggingNoPII: false,
    identityMetadata: process.env.AZURE_META,
    issuer: process.env.AZURE_ISUSER,
    resourceURL: "https://graph.windows.net",
    allowMultiAudiencesInToken: true,
    responseType: "id_token code",
  },
  function (token, done) {
    User.upsertAzureUser(token, function (err, user) {
      done(err, user);
    });
  }
);

/**
 * google social strategy
 * helps setup google auth
 * @name social/github
 * @inner
 *
 */
let googleStrategy = new GoogleTokenStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  function (accessToken, refreshToken, profile, done) {
    User.upsertGoogleUser(accessToken, refreshToken, profile, function (err, user) {
      return done(err, user);
    });
  }
);

passport.use(azureStrategy);
passport.use(googleStrategy);
passport.use(githubStrategy);

module.exports = passport;
