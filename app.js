const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const orderRoutes = require("./routes/order");
const passwordRoutes = require("./routes/password");
const expenseFileRoutes = require("./routes/expense-file");

const sequelize = require("./util/database");
const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");
const ForgotPasswordRequests = require("./models/password");
const ExpenseFile = require("./models/expense-file");
const { env } = require("process");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/order", orderRoutes);
app.use("/password", passwordRoutes);
app.use("/expense-file", expenseFileRoutes);

app.use("/", (req, res, next) => {
  res.status(200).sendFile(path.join(__dirname, `public/${req.url}`));
});

app.use("/", (req, res, next) => {
  res.status(404).send("<h1>Oops...Page Not Found</h1>");
});

User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);
User.hasMany(ExpenseFile);
ExpenseFile.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => console.log(err));
