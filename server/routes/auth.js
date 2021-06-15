var express = require("express");
var router = express.Router();
var auth = require("../controllers/auth");

router.post("/signup", auth.signup);
router.post("/login", auth.login);
router.get("/refresh", auth.refresh);
const isLoggedIn = require("../middlewares/isLoggedIn");
router.use(isLoggedIn);
router.get("/logout", auth.logout);

module.exports = router;
