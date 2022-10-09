const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET_KEY,
});

exports.getExpenseFile = (req, res, next) => {
  req.user
    .getExpenses()
    .then((expenses) => {
      return JSON.stringify(expenses);
    })
    .then((expenseData) => {
      const filename = `Expense/${req.user.name}/${new Date()}.txt`;
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: filename,
        Body: expenseData,
        ACL: "public-read",
      };
      return new Promise((resolve, reject) => {
        s3.upload(params, function (err, data) {
          if (err) {
            reject(err);
          }
          resolve(data.Location);
        });
      });
    })
    .then((fileURL) => {
      console.log(fileURL);
      return req.user.createExpensefile({ fileUrl: fileURL });
    })
    .then((expenseFile) => {
      res.status(200).send({ fileURL: expenseFile.fileUrl });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.getDownloadHistory = (req, res, next) => {
  req.user
    .getExpensefiles({ order: [["createdAt", "DESC"]] })
    .then((expenseFiles) => {
      res.status(200).send(expenseFiles);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};
