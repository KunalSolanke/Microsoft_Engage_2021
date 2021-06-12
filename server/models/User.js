const mongoose = require("mongoose");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      minLength: 4,
    },
    email: {
      type: String,
      required: true,
      minLength: 4,
    },
    isAdmin:Boolean,
    fullName: {
      type: String,
    },
    profile_pic: {
      contentType: String,
    },
    bio: {
      type: String,
    },
    password: {
      type: String,
      minLength: 6,
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

/* hash new password before saving to db  */
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = bycrpt.hash(user.password, 8);
  }
  next();
});


/* Can be used to create autb token for users */
userSchema.methods.generateAuthToken = async function (expiry) {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_KEY, {
    expiresIn: expiry,
  });
  return token;
};


/* Following fn can be used to find user by email and pass */
userSchema.statics.findByCredentials = async function (email, password,isAdmin=false) {
  const user = await this.findOne({ email,isAdmin });
  if (!user) {
    throw new Error({
      error: {
        message: "No user with given email",
      },
    });
  }

  if (bycrpt.compare(password, user.password)) {
    return user;
  }
  throw new Error({
    error: {
      message: "Invalid Credentials",
    },
  });
};


const User = mongoose.model("User", userSchema);

module.exports = User;
