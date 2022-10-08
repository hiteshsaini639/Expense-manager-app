const express = require("express");

const userController = require("../controllers/user");
const middlewareController = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.get(
  "/premium-check",
  middlewareController.authenticate,
  userController.isUserPremium
);

module.exports = router;
