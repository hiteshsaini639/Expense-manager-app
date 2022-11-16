const Razorpay = require("razorpay");
const crypto = require("crypto");

const Order = require("../models/order");

const instance = new Razorpay({
  key_id: process.env.RZP_KEY_ID,
  key_secret: process.env.RZP_KEY_SECRET,
});

exports.postOrder = (req, res, next) => {
  const options = {
    amount: req.body.amount, // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11",
  };
  instance.orders
    .create(options)
    // .then((order) => {
    // return req.user.createOrder({
    //   id: order.id,
    //   amount: order.amount,
    // });
    // })
    .then((order) => {
      res.status(201).send({ orderId: order.id });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.verifyOrder = (req, res, next) => {
  const orderId = req.body.response.razorpay_order_id;
  const paymentId = req.body.response.razorpay_payment_id;
  const razorpaySignature = req.body.response.razorpay_signature;
  let orderPlaced;
  Order.findByPk(orderId)
    .then((order) => {
      orderPlaced = order;
      const body = order.id + "|" + paymentId;
      return crypto
        .createHmac("sha256", process.env.RZP_KEY_SECRET)
        .update(body.toString())
        .digest("hex");
    })
    .then((expectedSignature) => {
      if (expectedSignature === razorpaySignature) {
        orderPlaced.update({
          paymentId,
          status: "paid",
        });
        res.status(200).send({ signatureIsValid: true });
      } else {
        res.status(200).send({ signatureIsValid: false });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};
