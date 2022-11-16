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
  const { amount, category, description } = req.body;
  const dateNumber = +req.query.dateNumber;
  if (isNotValid(category) || isNotValid(amount) || isNotValid(dateNumber)) {
    return res
      .status(400)
      .send({ type: "error", message: "Invalid Form Data!" });
  }
  const now = new Date();
  const date = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + dateNumber
  );

  const expense = new Expense(
    amount,
    category,
    description,
    date.getDate(),
    date.getMonth(),
    date.getFullYear(),
    req.user._id
  );

  expense
    .save()
    .then((result) => {
      res.status(201).send({
        expense: {
          id: result.insertedId,
          amount: amount,
          category: category,
          description,
          description,
        },
        notification: {
          type: "success",
          message: `${category} Expense Added.`,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.getExpensesByDate = (req, res, next) => {
  const dateNumber = +req.query.dateNumber;
  if (isNotValid(dateNumber)) {
    return res
      .status(400)
      .send({ type: "error", message: "Bad Query Parameters!" });
  }
  const now = new Date();
  const page = +req.query.page;
  const rows = +req.query.rows;
  const offset = (page - 1) * rows;
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

  let sumAndCount = { count: 0, total: 0 };
  Expense.getSumAndCount(
    req.user._id,
    date.getDate(),
    date.getMonth(),
    date.getFullYear()
  )
    .then((sumAndCounts) => {
      if (sumAndCounts) {
        sumAndCount = sumAndCounts;
      }
      return Expense.getExpenses(
        req.user._id,
        date.getDate(),
        date.getMonth(),
        date.getFullYear(),
        offset,
        rows
      );
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
  const monthNumber = +req.query.monthNumber;
  if (isNotValid(monthNumber)) {
    return res
      .status(400)
      .send({ type: "error", message: "Bad Query Parameters!" });
  }
  const now = new Date();
  const firstDayOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + monthNumber,
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
      console.log(err);
      res.status(500).send(err);
    });
};

exports.getExpensesByYear = (req, res, next) => {
  const yearNumber = +req.query.yearNumber;
  if (isNotValid(yearNumber)) {
    return res
      .status(400)
      .send({ type: "error", message: "Bad Query Parameters!" });
  }
  const year = new Date().getFullYear() + yearNumber;
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
      console.log(err);
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
      console.log(err);
      res.status(500).send(err);
    });
};

exports.deleteExpense = (req, res, next) => {
  const expenseId = +req.params.expenseId;
  if (isNotValid(expenseId)) {
    return res
      .status(400)
      .send({ type: "error", message: "Bad Query Parameters!" });
  }
  Expense.findByPk(expenseId)
    .then((expense) => {
      return expense.destroy();
    })
    .then(() => {
      res
        .status(200)
        .send({ type: "success", message: "Expense Deleted Successfully." });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};
