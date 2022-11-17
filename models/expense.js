const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class Expense {
  constructor(amount, category, description, date, month, year, userId) {
    this.amount = amount;
    this.category = category;
    this.description = description;
    this.date = date;
    this.month = month;
    this.year = year;
    this.userId = new mongodb.ObjectId(userId);
  }

  save() {
    const db = getDb();
    return db.collection("expenses").insertOne(this);
  }

  static getSumAndCount(userId, date, month, year) {
    const db = getDb();
    return db
      .collection("expenses")
      .aggregate([
        {
          $match: { userId: userId, date: date, month: month, year: year },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            total: { $sum: { $toInt: "$amount" } },
          },
        },
      ])
      .next();
  }

  static getSumInMonth(userId, month, year) {
    const db = getDb();
    return db
      .collection("expenses")
      .aggregate([
        {
          $match: { userId: userId, month: month, year: year },
        },
        {
          $group: {
            _id: null,
            sum: { $sum: { $toInt: "$amount" } },
          },
        },
      ])
      .next();
  }

  static getExpensesInYear(userId, year) {
    const db = getDb();
    return db
      .collection("expenses")
      .aggregate([
        {
          $match: { userId: userId, year: year },
        },
        {
          $group: {
            _id: "$month",
            monthlySum: { $sum: { $toInt: "$amount" } },
          },
        },
      ])
      .toArray();
  }

  static getExpenses(userId, date, month, year, offset, limit) {
    const db = getDb();
    return db
      .collection("expenses")
      .find({ userId: userId, date: date, month: month, year: year })
      .skip(offset)
      .limit(limit)
      .toArray();
  }

  static userWithTotalExpense() {
    const db = getDb();
    return db
      .collection("expenses")
      .aggregate([
        {
          $group: {
            _id: "$userId",
            userTotalExpense: { $sum: { $toInt: "$amount" } },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $project: {
            _id: 1,
            name: "$user.name",
            userTotalExpense: 1,
          },
        },
      ])
      .toArray();
  }

  static removeOne(id) {
    const db = getDb();
    return db
      .collection("expenses")
      .deleteOne({ _id: new mongodb.ObjectId(id) });
  }
}

module.exports = Expense;
