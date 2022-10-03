const express = require("express");

const expenseController = require("../controllers/expense");

const router = express.Router();

router.post("/add", expenseController.postExpense);

router.get("/get-by-date", expenseController.getExpensesByDate);

router.get("/get-by-month", expenseController.getExpensesByMonth);

router.get("/get-by-year", expenseController.getExpensesByYear);

module.exports = router;
