const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const Order = require("../models/order");
const User = require("../models/user");
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
  User.findByEmail(email)
    .then((user) => {
      if (user) {
        throw { type: "error", message: "User Already Exists!" };
      } else return user;
    })
    .then(() => {
      return bcrypt.hash(password, saltRounds);
    })
    .then((hash) => {
      const user = new User(name, email, hash);
      return user.save();
    })
    .then((result) => {
      res.status(201).send();
    })
    .catch((err) => {
      if (err.type === "error") {
        res.status(403).send(err);
      } else {
        console.log(err);
        res.status(500).send(err);
      }
    });
};

exports.login = (req, res, next) => {
  let _user;
  const { email, password } = req.body;
  if (isNotValid(email) || isNotValid(password)) {
    return res
      .status(400)
      .send({ type: "error", message: "Invalid Form Data!" });
  }
  User.findByEmail(email)
    .then((user) => {
      if (!user) {
        throw { type: "error", message: "User Not Found!" };
      } else {
        _user = user;
        return bcrypt.compare(password, user.password);
      }
    })
    .then((result) => {
      if (result) {
        const token = jwt.sign(
          { userId: _user._id, userEmail: _user.email },
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
        console.log(err);
        res.status(500).send(err);
      }
    });
};

exports.isUserPremium = (req, res, next) => {
  // Order.findOne({ where: { status: "paid", userId: req.user.id } })
  //   .then((order) => {
  //     if (order) {
  //       return res.status(200).send({
  //         isPremium: true,
  //         userName: req.user.name,
  //         userEmail: req.user.email,
  //       });
  //     } else {
  //       return res.status(200).send({
  //         isPremium: false,
  //         userName: req.user.name,
  //         userEmail: req.user.email,
  //       });
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(500).send(err);
  //   });
  return res.status(200).send({
    isPremium: false,
    userName: req.user.name,
    userEmail: req.user.email,
  });
};
