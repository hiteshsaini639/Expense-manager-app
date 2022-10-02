const express = require("express");

const expenseController = require("../controllers/expense");

const router = express.Router();

router.post("/add", expenseController.postExpense);

router.get("/get", expenseController.getExpenses);

module.exports = router;
