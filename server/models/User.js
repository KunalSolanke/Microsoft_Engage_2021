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

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bycrpt.hash(user.password, 8);
    console.log(user.password);
  }
  next();
});

userSchema.methods.generateAuthToken = async function (expiry) {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_KEY, {
    expiresIn: expiry,
  });
  return token;
};

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error({
      error: {
        message: "No user with given email",
      },
    });
  }
  console.log(user);
  let res = await bycrpt.compare(password, user.password);
  console.log(res);
  if (res) {
    return user;
  }
  throw new Error({
    error: {
      message: "Invalid Credentials",
    },
  });
};

userSchema.statics.upsertAzureUser = async function (token, cb) {
  console.log(token);
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

userSchema.statics.upsertGoogleUser = async function (accessToken, refreshToken, profile, cb) {
  let emails = [];
  if (profile.emails) {
    emails = profile.emails.map((e) => e.value);
  }

  console.log(profile);
  var that = this;
  let user = await this.findOne({
    "googleProvider.id": profile.id,
  });

  if (!user) {
    user = await this.findOne({}).where("email").in(emails);
    if (user && !user.image) {
      user.image = profile.picture || null;
      await user.save();
    }
  }
  if (!user) {
    var newUser = new that({
      fullName: profile.displayName || null,
      username: profile.displayName || null,
      email: profile.emails[0].value || profile.email || null,
      googleProvider: {
        id: profile.id,
        token: accessToken,
      },
      image: profile.picture || null,
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

userSchema.statics.upsertGithubUser = async function (accessToken, refreshToken, profile, cb) {
  let emails = [];
  if (profile.emails) {
    emails = profile.emails.map((e) => e.value);
  }

  console.log(profile);
  var that = this;
  let user = await this.findOne({
    "githubProvider.id": profile.id,
  });

  if (!user) {
    user = await this.findOne({}).where("email").in(emails);
    if (user && !user.image) {
      user.image = profile.avatar_url || null;
      await user.save();
    }
  }
  if (!user) {
    var newUser = new that({
      fullName: profile.displayName || profile.username || null,
      username: profile.displayName || profile.username || null,
      email: profile.emails[0].value || profile.email || null,
      githubProvider: {
        id: profile.id,
        token: accessToken,
      },
      image: profile.avatar_url || null,
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

userSchema.statics.findByRefreshToken = async function (token) {
  console.log(token);
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
