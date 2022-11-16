const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class User {
  constructor(name, email, password, id) {
    this.name = name;
    this.email = email;
    this.password = password;
    if (id) {
      this._id = new mongodb.ObjectId(id);
    }
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  static findByEmail(email) {
    const db = getDb();
    return db.collection("users").findOne({ email: email });
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) });
  }
}

// const User = sequelize.define("users", {
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   password: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

module.exports = User;
