const sgMail = require("@sendgrid/mail");
const path = require("path");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const ForgotPasswordRequest = require("../models/password");

const saltRounds = 10;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function isNotValid(str) {
  if (str == undefined || str.length === 0) return true;
  else return false;
}

exports.sendResetPasswordMail = (req, res, next) => {
  const email = req.body.email;
  if (isNotValid(email)) {
    return res
      .status(400)
      .send({ type: "error", message: "Invalid Form Data!" });
  }
  User.findAll({ where: { email: email } })
    .then((users) => {
      if (users.length === 0) {
        throw { type: "error", message: "User Not Found!" };
      } else {
        return users[0];
      }
    })
    .then((user) => {
      const id = uuid.v4();
      return user.createForgotpasswordrequest({ id: id, isActive: true });
    })
    .then((request) => {
      const msg = {
        to: email, // Change to your recipient
        from: "hiteshsaini639@gmail.com", // Change to your verified sender
        subject: "no-reply@Expense Manager",
        text: "Please click below to reset your password for Expense Manager",
        html: `<!DOCTYPE html><html lang="en-US"><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type" /><style type="text/css">a:hover {text-decoration: underline !important;}</style></head><body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8" leftmargin="0" ><table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style=" @import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: "Open Sans", sans-serif;"><tr><td><table style="background-color: #f2f3f8; max-width: 670px; margin: 0 auto" width="100%" border="0" align="center" cellpadding="0" cellspacing="0"><tr><td style="height: 80px">&nbsp;</td></tr><tr><td style="text-align: center"><h1 style="color: #1e1e2d">Expense Manager</h1></td></tr><tr><td style="height: 20px">&nbsp;</td></tr><tr><td><table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style=" max-width: 670px;background: #fff" border-radius: 3px;text-align: center;-webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);-moz-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);"><tr><td style="height: 40px">&nbsp;</td></tr><tr><td style="padding: 0 35px"><h1 style=" color: #1e1e2d;font-weight: 500;margin: 0; font-size: 32px;font-family: "Rubik", sans-serif;">You have requested to reset your password</h1><span style="display: inline-block;vertical-align: middle;margin: 29px 0 26px;border-bottom: 1px solid #cecece width: 100px;"></span><p style="color: #455056; font-size: 15px;line-height: 24px;margin: 0;">We cannot simply send you your old password. A unique link to reset your password has been generated for you.To reset your password, click the following link or reset button and follow the instructions. </br> <a href="http://52.69.79.61:3000/password/forgotpassword/${request.id}">http://52.69.79.61:3000/password/forgotpassword/${request.id}</a>
        </p><a href="http://52.69.79.61:3000/password/forgotpassword/${request.id}"style="background: #20e277;text-decoration: none !important;font-weight: 500;margin-top: 35px;color: #fff;text-transform: uppercase;font-size: 14px;padding: 10px 24px;display: inline-block;border-radius: 50px;">Reset Password</a></td></tr><tr><td style="height: 40px">&nbsp;</td></tr></table></td></tr><tr><td style="height: 80px">&nbsp;</td></tr></table></td></tr></table></body></html>`,
      };
      return sgMail.send(msg);
    })
    .then(() => {
      res
        .status(200)
        .send({ type: "success", message: "An email has been Sent" });
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

exports.getResetLink = (req, res, next) => {
  const uuid = req.params.uuid;
  ForgotPasswordRequest.findAll({ where: { id: uuid } })
    .then((request) => {
      if (request.length === 0) {
        return res.status(404).send("<h1>Link Does Not Exists!</h1>");
      } else if (request[0].isActive) {
        request[0].update({
          isActive: false,
        });
        res
          .status(200)
          .sendFile(path.join(__dirname, "../public/new-password.html"));
      } else {
        return res.status(200).send("<h1>Link has been Expired!</h1>");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.createNewPassword = (req, res, next) => {
  let existingUser;
  const { email, newPassword } = req.body;
  if (isNotValid(email) || isNotValid(newPassword)) {
    return res
      .status(400)
      .send({ type: "error", message: "Invalid Form Data!" });
  }
  User.findAll({ where: { email: email } })
    .then((users) => {
      if (users.length === 0) {
        throw { type: "error", message: `${email} Not Found!` };
      } else return users[0];
    })
    .then((user) => {
      existingUser = user;
      return bcrypt.hash(newPassword, saltRounds);
    })
    .then((hash) => {
      return existingUser.update({ password: hash });
    })
    .then((result) => {
      res.status(200).send();
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
