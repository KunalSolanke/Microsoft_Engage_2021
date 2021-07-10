/**
 * isLogged in  middleware
 * Check if user if logged in or not
 * @name accounts/auth/middleware/isloggedin1
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 *
 */
const isLogedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).send("Not Loged in!");
  }
};

module.exports = isLogedIn;
