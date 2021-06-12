const express = require("express");

const router = express.Router();
const userRouter = require("./users");
const socialRouter = require("./social")
const authRouter = require("./auth")
const indexController = require("../controllers/index");

/* GET CONTROLLER */
router.get("/", indexController.indexView);


//= ==================================== DECLARE ALL YOUR ROUTERS HERE ==================================

router.use("/auth", authRouter);
router.use("/auth/social",socialRouter);
router.use("/users", userRouter);

module.exports = router;
