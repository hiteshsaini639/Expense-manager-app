const User = require("../models/user");

exports.signup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  if (!name || !email || !password) {
    return res
      .status(400)
      .send({ type: "error", message: "Invalid Form Data!" });
  }
  User.findAll({ where: { email: email } })
    .then((users) => {
      if (users.length > 0) {
        throw { type: "error", message: "User Already Exists!" };
      } else return users;
    })
    .then(() => {
      return User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
    })
    .then((result) => {
      res.status(201).send();
    })
    .catch((err) => {
      if (err.type === "error") {
        res.status(403).send(err);
      } else console.log(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res
      .status(400)
      .send({ type: "error", message: "Invalid Form Data!" });
  }
  User.findAll({ where: { email: email } })
    .then((users) => {
      if (users.length === 0) {
        throw { type: "error", message: "User Does Not Exists!" };
      } else return users;
    })
    .then(([user]) => {
      if (user.password === password) {
        return res.status(200).send();
      } else {
        return res
          .status(403)
          .send({ type: "error", message: "Wrong Password!" });
      }
    })
    .catch((err) => {
      if (err.type === "error") {
        res.status(404).send(err);
      } else console.log(err);
    });
};
