const express = require("express");

const passwordController = require("../controllers/password");

const router = express.Router();

router.get("/forgotpassword/:uuid", passwordController.getResetLink);

router.post("/forgotpassword", passwordController.sendResetPasswordMail);

router.post("/new-password", passwordController.createNewPassword);

module.exports = router;
