const express = require("express");

const expenseController = require("../controllers/expense");
const middlewareController = require("../middlewares/auth");

const router = express.Router();

router.post(
  "/add",
  middlewareController.authenticate,
  expenseController.postExpense
);

router.get(
  "/get-by-date",
  middlewareController.authenticate,
  expenseController.getExpensesByDate
);

router.get(
  "/get-by-month",
  middlewareController.authenticate,
  expenseController.getExpensesByMonth
);

router.get(
  "/get-by-year",
  middlewareController.authenticate,
  expenseController.getExpensesByYear
);

router.get(
  "/leaderboard",
  middlewareController.authenticate,
  expenseController.getLeaderboard
);

module.exports = router;
