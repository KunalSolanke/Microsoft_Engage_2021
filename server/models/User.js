const mongoose = require("mongoose");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    image: String,
    username: {
      type: String,
    },
    fullName: {
      type: String,
    },
    bio: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      required: true,
      default: "member",
    },
    facebookProvider: {
      type: {
        id: String,
        token: String,
      },
      select: false,
    },
    githubProvider: {
      type: {
        id: String,
        token: String,
      },
      select: false,
    },
    azureProvider: {
      type: {
        id: String,
        token: String,
      },
      select: false,
    },
    googleProvider: {
      type: {
        id: String,
        token: String,
      },
      select: false,
    },
    refreshTokens: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", { getters: true, virtuals: true });

/**
 * Pre save hook user
 * if password is modified hash it and then insert in db
 *
 * @name models/users/presave
 * @inner
 *
 */
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bycrpt.hash(user.password, 8);
  }
  next();
});

/**
 * Generate auth token for user
 * create auth token for current user with given expiry
 *
 * @name models/users/genToken
 * @inner
 * @param {*} expiry
 */
userSchema.methods.generateAuthToken = async function (expiry) {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_KEY, {
    expiresIn: expiry,
  });
  return token;
};

/**
 * find user by creds
 * find user by given email and password
 *
 * @name models/users/find
 * @inner
 * @param {*} email
 * @param {*} password
 */
userSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error({
      error: {
        message: "No user with given email",
      },
    });
  }
  let res = await bycrpt.compare(password, user.password);
  if (res) {
    return user;
  }
  throw new Error({
    error: {
      message: "Invalid Credentials",
    },
  });
};

/**
 * Azure user add
 * add user profile from azure strategy
 *
 * @name models/users/azure_add
 * @inner
 * @param {*} token
 * @param {*} cb
 */
userSchema.statics.upsertAzureUser = async function (token, cb) {
  var that = this;
  let user = await this.findOne({
    "azureProvider.id": token.oid,
  });

  if (!user) {
    user = await this.findOne({
      email: token.preferred_username || token.email,
    });
  }
  if (!user) {
    var newUser = await new that({
      fullName: token.name || token.preferred_username || null,
      username: token.name || token.preferred_username || null,
      email: token.preferred_username || token.email || null,
      azureProvider: {
        id: token.oid,
      },
    });

    await newUser.save(function (error, savedUser) {
      if (error) {
        console.log(error);
      }
      return cb(error, savedUser);
    });
  } else {
    return cb(null, user);
  }
};

/**
 * Google user add
 * add user profile from google passport streategy
 *
 * @name models/users/google_add
 * @inner
 * @param {*} accessToken
 * @param {*} refreshToken
 * @param {*} profile
 * @param {*} cb
 */
userSchema.statics.upsertGoogleUser = async function (accessToken, refreshToken, profile, cb) {
  let emails = [];
  if (profile.emails) {
    emails = profile.emails.map((e) => e.value);
  }

  var that = this;
  let user = await this.findOne({
    "googleProvider.id": profile.id,
  });

  if (!user) {
    user = await this.findOne({}).where("email").in(emails);
  }
  if (user && !user.image) {
    try {
      user.image = profile._json.picture || null;
      await user.save();
    } catch (err) {
      console.log(err);
    }
  }
  if (!user) {
    var newUser = new that({
      fullName: profile.displayName || null,
      username: profile.name.givenName || profile.displayName || null,
      email: profile._json.email || profile.emails[0].value || null,
      googleProvider: {
        id: profile.id,
        token: accessToken,
      },
      image: profile._json.picture || null,
    });

    await newUser.save(function (error, savedUser) {
      if (error) {
        console.log(error);
      }
      return cb(error, savedUser);
    });
  } else {
    return cb(null, user);
  }
};

/**
 * github user add
 * add user profile from github strategy
 *
 * @name models/users/github_add
 * @inner
 * @param {*} accessToken
 * @param {*} refreshToken
 * @param {*} profile
 * @param {*} cb
 */
userSchema.statics.upsertGithubUser = async function (accessToken, refreshToken, profile, cb) {
  let emails = [];
  if (profile.emails) {
    emails = profile.emails.map((e) => e.value);
  }


  var that = this;
  let user = await this.findOne({
    "githubProvider.id": profile.id,
  });

  if (!user) {
    user = await this.findOne({}).where("email").in(emails);
  }
  if (user && !user.image) {
    try {
      user.image = profile.photos[0] || profile._json.avatar_url || null;
      await user.save();
    } catch (err) {
      console.log(err);
    }
  }
  if (!user) {
    var newUser = new that({
      fullName: profile.displayName || profile.username || null,
      username: profile.name.givenName || profile.displayName || null,
      email: profile.emails[0].value || profile.email || null,
      githubProvider: {
        id: profile.id,
        token: accessToken,
      },
      image: profile.photos[0] || profile._json.avatar_url || null,
    });

    await newUser.save(function (error, savedUser) {
      if (error) {
        console.log(error);
      }
      return cb(error, savedUser);
    });
  } else {
    return cb(null, user);
  }
};

/**
 * find user by refresh token auth
 * @param {string} token
 *
 * @name models/users/findByToken
 * @inner
 *
 */
userSchema.statics.findByRefreshToken = async function (token) {
  try {
    let { _id } = await jwt.verify(token, process.env.JWT_REFRESH_KEY);
    let user = await this.findById(_id);
    if (user.refreshTokens.includes(token)) {
      return user;
    } else {
      throw new Error("no User found");
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
