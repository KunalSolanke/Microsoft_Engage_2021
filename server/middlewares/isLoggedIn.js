const isLogedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).send("Not Loged in!");
  }
};

module.exports = isLogedIn;
