var express = require("express");
var router = express.Router();
var auth = require("../controllers/auth");
const upload = require("../middlewares/azure_multer");
const profile = require("../controllers/profile");

router.post("/signup", auth.signup);
router.post("/login", auth.login);
router.get("/refresh", auth.refresh);
const isLoggedIn = require("../middlewares/isLoggedIn");
router.use(isLoggedIn);
router.get("/logout", auth.logout);
router.get("/profile", profile.getProfile);
router.post("/profile", upload.single("image"), profile.updateProfile);
router.get("/contacts/me", profile.getMyContacts);
router.get("/teams/me", profile.getMyTeams);
module.exports = router;
