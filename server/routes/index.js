const express = require("express");

const router = express.Router();
const userRouter = require("./users");
const socialRouter = require("./social");
const authRouter = require("./auth");
const meetRouter = require("./meet");
const indexController = require("../controllers/index");
const authMiddleware = require("../middlewares/auth");

/* GET CONTROLLER */
router.get("/", indexController.indexView);
router.use(authMiddleware);

//= ==================================== DECLARE ALL YOUR ROUTERS HERE ==================================

router.use("/auth/social", socialRouter);
router.use("/accounts", authRouter);
router.use("/users", userRouter);
router.use("/meet", meetRouter);

module.exports = router;
