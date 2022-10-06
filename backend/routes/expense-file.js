const express = require("express");

const expenseFileController = require("../controllers/expense-file");
const middlewareController = require("../middlewares/auth");

const router = express.Router();

router.get(
  "/download",
  middlewareController.authenticate,
  expenseFileController.getExpenseFile
);

router.get(
  "/download-history",
  middlewareController.authenticate,
  expenseFileController.getDownloadHistory
);

module.exports = router;
