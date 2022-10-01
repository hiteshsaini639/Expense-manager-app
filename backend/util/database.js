const Sequelize = require("sequelize");

const sequelize = new Sequelize("expense-manager", "root", "ikka@#4321", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
