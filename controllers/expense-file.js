const AWS = require("aws-sdk");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const ExpenseFile = require("../models/expense-file");

const s3 = new AWS.S3({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET_KEY,
});

exports.getExpenseFile = (req, res, next) => {
  req.user
    .getExpenses()
    .then((expenses) => {
      const filename = `Expense/${req.user.name}/${new Date()}.pdf`;

      function rowGen(expenseData) {
        return expenseData.reduce((prev, curr) => {
          return (
            prev +
            `<tr>
                  <td>${curr.date}/${curr.month}/${curr.year}</td>
                  <td>${curr.amount}</td>
                  <td>${curr.category}</td>
                  <td>${curr.description}</td>
                </tr>`
          );
        }, "");
      }

      const newHTML = `<!DOCTYPE html>
      <html>
        <head>
          <title>HTML content</title>
          <link rel="stylesheet" href="style.css" />
        </head>
        <body>
          <div class="header">
            <!--header-->
            <div class="title">
              <h1 class="name">${req.user.name}</h1>
              <div class="email">${req.user.email}</div>
            </div>
          </div>
          <!--header end-->
          <div>
            <table>
              <!-- <caption>
                Title
              </caption> -->
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
              ${rowGen(expenses)}
              </tbody>
            </table>
          </div>
        </body>
      </html>
      `;

      fs.writeFileSync(
        "pdf/sample.html",
        newHTML,
        "utf-8",
        function (err, data) {
          if (err) throw err;
          console.log("Done!");
        }
      );

      async function pdfUpload() {
        const browser = await puppeteer.launch({ headless: true });

        const page = await browser.newPage();
        const html = fs.readFileSync("pdf/sample.html", "utf-8");
        await page.setContent(html, { waitUntil: "networkidle0" });

        await page.addStyleTag({ path: "pdf/style.css" });

        await page.emulateMediaType("screen");

        const pdf = await page.pdf({
          margin: { top: "10px", right: "5px", bottom: "10px", left: "5px" },
          printBackground: true,
          format: "A4",
        });

        await browser.close();

        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: filename,
          Body: pdf,
          ContentType: "application/pdf",
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
      }

      return pdfUpload();
    })
    .then((fileURL) => {
      const newExpenseFile = new ExpenseFile(req.user._id, fileURL);
      newExpenseFile.save().then(() => {
        res.status(200).send({ fileURL: fileURL });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.getDownloadHistory = (req, res, next) => {
  ExpenseFile.getExpensefiles(req.user._id)
    .then((expenseFiles) => {
      res.status(200).send(expenseFiles);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};
