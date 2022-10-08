const express = require("express");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
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

const app = express();
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

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
    app.listen(3000);
  })
  .catch((err) => console.log(err));
