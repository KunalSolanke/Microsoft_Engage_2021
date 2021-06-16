const express = require("express");

const router = express.Router();
const userController = require("../controllers/users.js");

/* GET users listing. */
router.get("/find", userController.findUsers);

module.exports = router;
