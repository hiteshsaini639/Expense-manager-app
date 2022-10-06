const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const ExpenseFile = sequelize.define("expensefiles",{
    id:{
        type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    fileUrl:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports = ExpenseFile;