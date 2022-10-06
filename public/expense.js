const navBtns = document.querySelectorAll(".nav-btn");
const nav = document.getElementById("nav");
const crossBtn = document.getElementById("cross-btn");
const addExpenseEle = document.querySelector(".add-expense");
const addExpenseContainer = document.getElementById("add-expense-container");
const msg = document.querySelector(".msg");
const form = document.querySelector("form");
const dailyExpenseContainer = document.getElementById(
  "daily-expense-container"
);
const yearlyExpenseContainer = document.getElementById(
  "yearly-expense-container"
);
const leaderboardContainer = document.getElementById(
  "leaderboard-expense-container"
);
const flexContainer = document.getElementById("flex-container");
const dateELe = document.querySelector(".date");
const monthELe = document.querySelector(".month");
const yearELe = document.querySelector(".year");
const dailyInfoBar = document.getElementById("daily-info-bar");
const monthlyInfoBar = document.getElementById("monthly-info-bar");
const yearlyInfoBar = document.getElementById("yearly-info-bar");
const monthlySum = document.getElementById("monthly-sum");
const dailySum = document.getElementById("daily-sum");
const rzpBtn = document.getElementById("rzp-button");
const userBtn = document.getElementById("user-btn");
const leaderbordBtn = document.getElementById("leaderboard-btn");
const leaderbordBtn2 = document.getElementById("leaderboard-btn2");
const userContainer = document.getElementById("user-container");
const downloadBtn = document.getElementById("download-btn");
const showHistoryBtn = document.getElementById("download-history-btn");
const leaderboardHeading = document.getElementById("leaderboard-heading");
const historyHeading = document.getElementById("history-heading");

let orderId;
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

userBtn.addEventListener("click", () => {
  userContainer.classList.toggle("show-user");
});

dailyInfoBar.addEventListener("click", (e) => {
  if (e.target.closest(".left-btn")) {
    dateELe.id -= 1;
    loadDailyExpenseData(dateELe.id);
  }
  if (e.target.closest(".right-btn")) {
    dateELe.id = +dateELe.id + 1;
    loadDailyExpenseData(dateELe.id);
  }
});

monthlyInfoBar.addEventListener("click", (e) => {
  if (e.target.closest(".left-btn")) {
    monthELe.id -= 1;
    loadMonthlyExpenseData(monthELe.id);
  }
  if (e.target.closest(".right-btn")) {
    monthELe.id = +monthELe.id + 1;
    loadMonthlyExpenseData(monthELe.id);
  }
});

yearlyInfoBar.addEventListener("click", (e) => {
  if (e.target.closest(".left-btn")) {
    yearELe.id -= 1;
    loadYearlyExpenseData(yearELe.id);
  }
  if (e.target.closest(".right-btn")) {
    yearELe.id = +yearELe.id + 1;
    loadYearlyExpenseData(yearELe.id);
  }
});

crossBtn.addEventListener("click", () => {
  crossBtn.classList.toggle("rotate");
  addExpenseEle.classList.toggle("scale");
});

dailyExpenseContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("des-btn")) {
    e.target.parentElement.nextElementSibling.classList.toggle("show");
  }
});

nav.addEventListener("click", (e) => {
  if (e.target.classList.contains("nav-btn")) {
    removeActive();
    e.target.classList.add("active");
    flexContainer.style.transform = `translateX(${
      -550 * Number(e.target.id)
    }px)`;
    if (e.target.id === "0") {
      addExpenseContainer.style.display = "block";
    } else {
      addExpenseContainer.style.display = "none";
    }
  }
});

leaderbordBtn2.addEventListener("click", leaderbordHandler);
leaderbordBtn.addEventListener("click", leaderbordHandler);

function leaderbordHandler() {
  const token = localStorage.getItem("sessionToken");
  axios
    .get(`http://localhost:3000/expense/leaderboard`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        removeActive();
        leaderboardContainer.innerText = "";
        userContainer.classList.remove("show-user");
        flexContainer.style.transform = "translateX(-1650px)";
        display("inline-block", "none");
        response.data.userWiseExpense.forEach((userExpense) => {
          if (userExpense.id === response.data.userId) {
            showLeaderboard(userExpense, "background-color:green");
          } else {
            showLeaderboard(userExpense, "");
          }
        });
      } else {
        throw { response: response };
      }
    })
    .catch((err) => {
      console.log(err);
      notify(err.response.data);
    });
}

function removeActive() {
  navBtns.forEach((btn) => {
    btn.classList.remove("active");
  });
}

// show output on frontend
function showDailyExpense(expenseData) {
  const textNode = `<div class="expense-data-bar">
  <div class="bar">
    <button class="des-btn">${expenseData.category}</button>
    <div class="amount">${expenseData.amount} &#x20B9;</div>
    <div class="bar-btns">
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </div>
  </div>
  <div class="description" id="des">${expenseData.description}</div>
</div>`;
  dailyExpenseContainer.innerHTML += textNode;
}

function showYearlyExpense(monthData) {
  const textNode = `<div class="expense-data-bar">
  <div class="bar">
    <div class="total-by">${months[monthData.month]}</div>
    <div class="monthly-total">${monthData.monthlySum} &#x20B9;</div>
  </div>
</div>`;
  yearlyExpenseContainer.innerHTML += textNode;
}

function showLeaderboard(leaderboardData, highlight) {
  const textNode = `<div class="expense-data-bar" style="${highlight}">
  <div class="bar">
    <div class="user-name">${leaderboardData.name}</div>
    <div class="user-total">${
      leaderboardData.userTotalExpense == null
        ? 0
        : leaderboardData.userTotalExpense
    } &#x20B9;</div>
  </div>
</div>`;
  leaderboardContainer.innerHTML += textNode;
}

//show msg function
function notify(notication) {
  msg.textContent = notication.message;
  msg.classList.add(notication.type);
  setTimeout(() => {
    msg.classList.remove(notication.type);
    msg.textContent = "";
  }, 2000);
}

window.addEventListener("DOMContentLoaded", loadExpenseData);

function loadExpenseData() {
  loadDailyExpenseData(0);
  loadMonthlyExpenseData(0);
  loadYearlyExpenseData(0);
  createOrderId();
}

//creates new orderId everytime
function createOrderId() {
  axios
    .post(
      "http://localhost:3000/order/create-OrderId",
      {
        amount: "50000",
      },
      {
        timeout: 0,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      if (response.status === 201) {
        orderId = response.data.orderId;
        // $("button").show();
      } else {
        throw { response: response };
      }
    })
    .catch((err) => {
      console.log(err);
      notify(err.response.data);
    });
}

function loadDailyExpenseData(dateNumber) {
  const token = localStorage.getItem("sessionToken");
  axios
    .get(`http://localhost:3000/expense/get-by-date?dateNumber=${dateNumber}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        dailyExpenseContainer.innerText = "";
        dateELe.innerText = response.data.date;
        dailySum.innerText = response.data.dailySum;
        response.data.expenses.forEach((expense) => {
          showDailyExpense(expense);
        });
      } else {
        throw { response: response };
      }
    })
    .catch((err) => {
      console.log(err);
      notify(err.response.data);
    });
}

function loadMonthlyExpenseData(monthNumber) {
  const token = localStorage.getItem("sessionToken");
  axios
    .get(
      `http://localhost:3000/expense/get-by-month?monthNumber=${monthNumber}`,
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((response) => {
      if (response.status === 200) {
        monthlySum.innerText = response.data.monthlySum;
        monthELe.innerText = response.data.month;
      } else {
        throw { response: response };
      }
    })
    .catch((err) => {
      console.log(err);
      notify(err.response.data);
    });
}

function loadYearlyExpenseData(yearNumber) {
  const token = localStorage.getItem("sessionToken");
  axios
    .get(`http://localhost:3000/expense/get-by-year?yearNumber=${yearNumber}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        yearlyExpenseContainer.innerText = "";
        yearELe.innerText = response.data.year;
        response.data.monthWiseSum.forEach((monthData) => {
          showYearlyExpense(monthData);
        });
      } else {
        throw { response: response };
      }
    })
    .catch((err) => {
      console.log(err);
      notify(err.response.data);
    });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const token = localStorage.getItem("sessionToken");
  axios
    .post(
      "http://localhost:3000/expense/add",
      {
        category: e.target.category.value,
        amount: e.target.amount.value,
        description: e.target.description.value,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((response) => {
      if (response.status === 201) {
        notify(response.data.notification);
        showDailyExpense(response.data.expense);
      } else {
        throw { response: response };
      }
    })
    .catch((err) => {
      console.log(err);
      notify(err.response.data);
    });
});

if (rzpBtn) {
  rzpBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const options = {
      key: "rzp_test_NfEzOE4dgBCx9v", // Enter the Key ID generated from the Dashboard
      amount: "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Expense Manager Pro",
      description: "Access to Premium Features",
      image: "./images/512x512bb-modified.png",
      order_id: orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: function (response) {
        const token = localStorage.getItem("sessionToken");
        axios
          .post(
            "http://localhost:3000/order/verify",
            { response },
            {
              timeout: 0,
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            }
          )
          .then((response) => {
            if (response.data.signatureIsValid) {
              location.href = "./success.html";
            } else {
              alert("Invalid Authentic Source! Try Again.");
            }
          });
      },
      notes: {
        address: "Hitesh Corporate Office",
      },
      theme: {
        color: "#112d4e",
      },
    };
    const rzp = new Razorpay(options);
    rzp.on("payment.failed", function (response) {
      alert("Transaction Failed! Try Again.");
      // alert(response.error.code);
      // alert(response.error.description);
      // alert(response.error.source);
      // alert(response.error.step);
      // alert(response.error.reason);
      // alert(response.error.metadata.order_id);
      // alert(response.error.metadata.payment_id);
    });
    rzp.open();
  });
}

downloadBtn.addEventListener("click", () => {
  const token = localStorage.getItem("sessionToken");
  axios
    .get(`http://localhost:3000/expense-file/download`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        let a = document.createElement("a");
        a.href = response.data.fileURL;
        a.download = "myexpense.csv";
        a.click();
      } else {
        throw { response: response };
      }
    })
    .catch((err) => {
      console.log(err);
      notify(err.response.data);
    });
});

// formating date local
function formatDate(date) {
  const daysPassed = Math.round((new Date() - date) / (1000 * 60 * 60 * 24));

  if (daysPassed === 0) return "Today";
  else if (daysPassed === 1) return "Yesterday";
  else if (daysPassed <= 3) return `${daysPassed} days ago`;
  else {
    const options = {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("en-IN", options).format(date);
  }
}

function showHistory(historyData) {
  const downloadedOn = formatDate(new Date(historyData.createdAt));
  const textNode = `<div class="expense-data-bar">
  <div class="bar">
    <div class="downloaded-time">${downloadedOn}</div>
    <div class="link"><a href="${historyData.fileUrl}" download><button><i class="fa fa-download fa-lg" aria-hidden="true"></i
      ></button></a></div>
  </div>
  </div>`;
  leaderboardContainer.innerHTML += textNode;
}

showHistoryBtn.addEventListener("click", () => {
  const token = localStorage.getItem("sessionToken");
  axios
    .get(`http://localhost:3000/expense-file/download-history`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        leaderboardContainer.innerText = "";
        display("none", "inline-block");
        response.data.forEach((each) => {
          showHistory(each);
        });
      } else {
        throw { response: response };
      }
    })
    .catch((err) => {
      console.log(err);
      notify(err.response.data);
    });
});

function display(type1, type2) {
  showHistoryBtn.style.display = type1;
  leaderboardHeading.style.display = type1;
  downloadBtn.style.display = type1;
  leaderbordBtn2.style.display = type2;
  historyHeading.style.display = type2;
}
