const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

function isNotValid(str) {
  if (str == undefined || str.length === 0) return true;
  else return false;
}

exports.signup = (req, res, next) => {
  const { name, email, password } = req.body;
  if (isNotValid(name) || isNotValid(email) || isNotValid(password)) {
    return res
      .status(400)
      .send({ type: "error", message: "Invalid Form Data!" });
  }
  User.findAll({ where: { email: email } })
    .then((users) => {
      if (users.length === 1) {
        throw { type: "error", message: "User Already Exists!" };
      } else return users;
    })
    .then(() => {
      return bcrypt.hash(password, saltRounds);
    })
    .then((hash) => {
      return User.create({ name, email, password: hash });
    })
    .then((result) => {
      res.status(201).send();
    })
    .catch((err) => {
      if (err.type === "error") {
        res.status(403).send(err);
      } else {
        res.status(500).send(err);
      }
    });
};

exports.login = (req, res, next) => {
  let user;
  const { email, password } = req.body;
  if (isNotValid(email) || isNotValid(password)) {
    return res
      .status(400)
      .send({ type: "error", message: "Invalid Form Data!" });
  }
  User.findAll({ where: { email: email } })
    .then((users) => {
      if (users.length === 0) {
        throw { type: "error", message: "User Not Found!" };
      } else {
        user = users[0];
        return bcrypt.compare(password, user.password);
      }
    })
    .then((result) => {
      if (result) {
        const token = jwt.sign(
          { userId: user.id, userEmail: user.email },
          process.env.TOKEN_SECRET_KEY
        );
        return res.status(200).send({
          sessionToken: token,
        });
      } else {
        return res
          .status(401)
          .send({ type: "error", message: "Wrong Password!" });
      }
    })
    .catch((err) => {
      if (err.type === "error") {
        res.status(404).send(err);
      } else {
        res.status(500).send(err);
      }
    });
};

exports.isUserPremium = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      if (orders.length === 0) {
        return res.status(200).send({
          isPremium: false,
          userName: req.user.name,
          userEmail: req.user.email,
        });
      } else {
        return res.status(200).send({
          isPremium: true,
          userName: req.user.name,
          userEmail: req.user.email,
        });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
