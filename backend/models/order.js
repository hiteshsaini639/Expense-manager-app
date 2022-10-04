const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Order = sequelize.define("orders", {
  orderId: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Order;
