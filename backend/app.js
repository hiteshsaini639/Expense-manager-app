const express = require("express");
const cors = require("cors");
const sequelize = require("./util/database");

const userRoutes = require("./routes/user");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/user", userRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
