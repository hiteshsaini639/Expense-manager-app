const Razorpay = require("razorpay");

const instance = new Razorpay({
  key_id: process.env.RZP_KEY_ID,
  key_secret: process.env.RZP_KEY_SECRET,
});

let orderId;
exports.postOrder = (req, res, next) => {
  const options = {
    amount: req.body.amount, // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11",
  };
  instance.orders
    .create(options)
    .then((order) => {
      orderId = order.id;
      res.status(201).send({ orderId: orderId });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.verifyOrder = (req, res, next) => {
  const body = orderId + "|" + req.body.response.razorpay_payment_id;
  const crypto = require("crypto");
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RZP_KEY_SECRET)
    .update(body.toString())
    .digest("hex");
  console.log("sig received ", req.body.response.razorpay_signature);
  console.log("sig generated ", expectedSignature);
  let response = { signatureIsValid: false };
  if (expectedSignature === req.body.response.razorpay_signature) {
    response = { signatureIsValid: true };
    req.user.createOrder({ orderId });
  }
  res.status(200).send(response);
};
