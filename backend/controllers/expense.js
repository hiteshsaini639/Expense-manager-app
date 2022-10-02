const Expense = require("../models/expense");

function isNotValid(str) {
  if (str == undefined || str.length === 0) return true;
  else return false;
}

exports.postExpense = (req, res, next) => {
  const { amount, category, description } = req.body;
  if (isNotValid(category) || isNotValid(amount)) {
    return res
      .status(400)
      .send({ type: "error", message: "Invalid Form Data!" });
  }
  Expense.create({ amount, category, description })
    .then((result) => {
      res.status(201).send({
        expense: result,
        notification: { type: "success", message: "Expense added" },
      });
    })
    .catch((err) => {
      if (err.type === "error") {
        res.status(403).send(err);
      } else {
        res.status(500).send(err);
      }
    });
};

exports.getExpenses = (req, res, next) => {
  Expense.findAll()
    .then((expenses) => {
      res.status(200).send(expenses);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
