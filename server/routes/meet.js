const express = require("express");

const router = express.Router();
const meetController = require("../controllers/meet");

/* GET users listing. */
router.post("/create", meetController.createMeet);

module.exports = router;
