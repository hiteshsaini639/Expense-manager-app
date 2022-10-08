const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const ForgotPasswordRequest = sequelize.define("forgotpasswordrequests", {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = ForgotPasswordRequest;
