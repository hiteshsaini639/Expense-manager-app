const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./util/database");
const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const orderRoutes = require("./routes/order");
const passwordRoutes = require("./routes/password");

const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");
const ForgotPasswordRequests = require("./models/password");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/order", orderRoutes);
app.use("/password", passwordRoutes);

app.use("/", (req, res, next) => {
  res.status(404).send({ success: false, message: "Oops...Page Not Found" });
});

User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
