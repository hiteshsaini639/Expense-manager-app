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
            _id: "$userId",
            count: { $sum: 1 },
            total: { $sum: { $toInt: "$amount" } },
          },
        },
      ])
      .next();
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
}

module.exports = Expense;
