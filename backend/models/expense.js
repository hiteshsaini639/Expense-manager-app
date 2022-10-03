const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Expense = sequelize.define(
  "expenses",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    date: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    month: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    year: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Expense;
