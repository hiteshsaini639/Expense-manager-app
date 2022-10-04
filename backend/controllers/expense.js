const { Sequelize } = require("sequelize");
const Expense = require("../models/expense");

function isNotValid(str) {
  if (str == undefined || str.length === 0) return true;
  else return false;
}

function formatDate(date, options) {
  return new Intl.DateTimeFormat("en-IN", options).format(date);
}

exports.postExpense = (req, res, next) => {
  const today = new Date();
  const { amount, category, description } = req.body;
  if (isNotValid(category) || isNotValid(amount)) {
    return res
      .status(400)
      .send({ type: "error", message: "Invalid Form Data!" });
  }
  req.user
    .createExpense({
      amount,
      category,
      description,
      date: today.getDate(),
      month: today.getMonth(),
      year: today.getFullYear(),
    })
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

const now = new Date();

exports.getExpensesByDate = (req, res, next) => {
  const date = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + Number(req.query.dateNumber)
  );
  const dateToSend = formatDate(date, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  let dailySum = 0;
  Expense.sum("amount", {
    where: {
      userId: req.user.id,
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
    },
  })
    .then((sum) => {
      dailySum = sum;
      return req.user.getExpenses({
        where: {
          date: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
        },
      });
    })
    .then((expenses) => {
      res
        .status(200)
        .send({ expenses: expenses, date: dateToSend, dailySum: dailySum });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.getExpensesByMonth = (req, res, next) => {
  const firstDayOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + Number(req.query.monthNumber),
    1
  );
  const monthToSend = formatDate(firstDayOfMonth, {
    month: "long",
    year: "numeric",
  });
  Expense.sum("amount", {
    where: {
      userId: req.user.id,
      month: firstDayOfMonth.getMonth(),
      year: firstDayOfMonth.getFullYear(),
    },
  })
    .then((sum) => {
      res.status(200).send({ monthlySum: sum, month: monthToSend });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.getExpensesByYear = (req, res, next) => {
  const year = new Date().getFullYear() + Number(req.query.yearNumber);
  req.user
    .getExpenses({
      where: {
        year: year,
      },
      attributes: [
        "month",
        [Sequelize.fn("SUM", Sequelize.col("amount")), "monthlySum"],
      ],
      group: ["month"],
    })
    .then((monthlyData) => {
      res.status(200).send({ monthWiseSum: monthlyData, year: year });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
