const express = require("express");

const orderController = require("../controllers/order");
const middlewareController = require("../middlewares/auth");

const router = express.Router();

router.post("/create-OrderId", orderController.postOrder);

router.post(
  "/verify",
  middlewareController.authenticate,
  orderController.verifyOrder
);

module.exports = router;
