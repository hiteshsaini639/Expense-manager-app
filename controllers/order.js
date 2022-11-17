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
  let orderId;
  instance.orders
    .create(options)
    .then((order) => {
      const newOrder = new Order(
        order.id,
        order.amount,
        "PENDING",
        "NULL",
        req.user._id
      );
      orderId = order.id;
      return newOrder.save();
    })
    .then(() => {
      res.status(201).send({ orderId: orderId });
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
  Order.findByOrderId(orderId)
    .then((order) => {
      orderPlaced = new Order(
        order.orderId,
        order.amount,
        order.status,
        order.paymentId,
        order.userId,
        order._id
      );
      const body = order.orderId + "|" + paymentId;
      return crypto
        .createHmac("sha256", process.env.RZP_KEY_SECRET)
        .update(body.toString())
        .digest("hex");
    })
    .then((expectedSignature) => {
      if (expectedSignature === razorpaySignature) {
        orderPlaced.update(paymentId, "paid").then(() => {
          res.status(200).send({ signatureIsValid: true });
        });
      } else {
        res.status(200).send({ signatureIsValid: false });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};
