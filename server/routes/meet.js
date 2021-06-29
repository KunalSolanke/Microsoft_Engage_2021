const express = require("express");

const router = express.Router();
const meetController = require("../controllers/meet");

/* GET users listing. */
router.post("/create", meetController.createMeet);
router.post("/contacts_add", meetController.createChat);
router.get("/chat/:chatID", meetController.getChat);
router.post("/teams_add", meetController.createTeam);
router.post("/channels_add", meetController.createChannel);
router.get("/team/:teamID", meetController.getTeam);
router.get("/channel/:channelID", meetController.getChannel);
router.get("/team/:teamID/join", meetController.joinTeam);
module.exports = router;
