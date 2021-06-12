const express = require("express");

const router = express.Router();
const userRouter = require("./users");

const indexController = require("../controllers/index");

/* GET CONTROLLER */
router.get("/", indexController.indexView);

//= ==================================== DECLARE ALL YOUR ROUTERS HERE ==================================

router.use("/users", userRouter);
module.exports = router;
