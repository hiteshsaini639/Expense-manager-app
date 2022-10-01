const User = require("../models/user");

exports.signup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  if (!name || !email || !password) {
    return res
      .status(400)
      .send({ type: "error", message: "Invalid Form Data" });
  }
  User.findAll({ where: { email: email } })
    .then((users) => {
      if (users.length > 0) {
        throw { type: "error", message: "User Already Exists" };
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
      res
        .status(201)
        .send(
          `Full name is:${req.body.name}, ${req.body.email},${req.body.password}`
        );
    })
    .catch((err) => {
      if (err.type === "error") {
        res.status(200).send(err);
      } else console.log(err);
    });
};
