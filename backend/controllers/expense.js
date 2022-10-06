const { Sequelize } = require("sequelize");
const Expense = require("../models/expense");
const User = require("../models/user");

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
  const dateNumber = +req.query.dateNumber;
  const page = +req.query.page;
  const rows = +req.query.rows;
  const date = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + dateNumber
  );
  const dateToSend = formatDate(date, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  let sumAndCount = { count: 0, sum: 0 };
  Expense.findAll({
    attributes: [
      [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
    ],
    group: ["userId"],
    where: {
      userId: 1,
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
    },
  })
    .then((sumAndCounts) => {
      sumAndCount = sumAndCounts[0];
      return req.user.getExpenses({
        where: {
          date: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
        },
        offset: (page - 1) * rows,
        limit: rows,
      });
    })
    .then((expenses) => {
      res.status(200).send({
        actualRows: expenses.length,
        expenses: expenses,
        date: dateToSend,
        totalAndCount: sumAndCount,
      });
    })
    .catch((err) => {
      console.log(err);
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

exports.getLeaderboard = (req, res, next) => {
  User.findAll({
    include: [{ model: Expense, attributes: [] }],
    attributes: [
      "id",
      "name",
      [Sequelize.fn("SUM", Sequelize.col("amount")), "userTotalExpense"],
    ],
    group: ["userId"],
    order: [["userTotalExpense", "ASC"]],
  })
    .then((users) => {
      res.status(200).send({ userWiseExpense: users, userId: req.user.id });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
