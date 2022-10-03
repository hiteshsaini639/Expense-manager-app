const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  try {
    const { userId } = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    User.findByPk(userId).then((user) => {
      req.user = user;
      next();
    });
  } catch (err) {
    console.log(err);
    res.status(401).send({ type: "error", message: "Authorized Failed!" });
  }
};
