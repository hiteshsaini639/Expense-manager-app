const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class ExpenseFile {
  constructor(userId, fileURL) {
    this.userId = userId;
    this.fileURL = fileURL;
    this.createdAt = new Date();
  }

  save() {
    const db = getDb();
    return db.collection("expensefiles").insertOne(this);
  }

  static getExpensefiles(id) {
    const db = getDb();
    return db
      .collection("expensefiles")
      .find({ userId: id })
      .sort({ created: 1 })
      .toArray();
  }
}

module.exports = ExpenseFile;
