const User = require("../models/User");

const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (err) {
    console.log(err.message);
    res.status(401).send(err.message);
  }
};

const updateProfile = async (req, res) => {
  const token = req.get("Authorization").split(" ")[1];
  console.log("token is ", token);
  try {
    let user = req.user;
    await User.findByIdAndUpdate(user._id, req.body);

    if (req.file) {
      user.image = {
        contentType: req.file.url,
      };
      await user.save();
    }
    user = await User.findById(user._id);
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(401).send(err.message);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
