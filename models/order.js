const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class Order {
  constructor(orderId, amount, status, paymentId, userId, id) {
    this.orderId = orderId;
    this.amount = amount;
    this.status = status;
    this.paymentId = paymentId;
    this.userId = new mongodb.ObjectId(userId);
    if (id) {
      this._id = new mongodb.ObjectId(id);
    }
  }

  save() {
    const db = getDb();
    return db.collection("orders").insertOne(this);
  }

  static findByOrderId(id) {
    const db = getDb();
    return db.collection("orders").findOne({ orderId: id });
  }

  static findOne(condition) {
    const db = getDb();
    return db.collection("orders").findOne(condition);
  }

  update(paymentId, status) {
    const db = getDb();
    return db
      .collection("orders")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { paymentId: paymentId, status: status } }
      );
  }
}

module.exports = Order;
