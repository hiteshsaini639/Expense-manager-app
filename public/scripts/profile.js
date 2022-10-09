const root = document.querySelector(":root");
const body = document.querySelector("body");
const nav = document.getElementById("nav");
const navBtns = document.querySelectorAll(".nav-btn");
const proEle = document.getElementById("pro");
const userNameEle = document.getElementById("user-name");
const userEmailEle = document.getElementById("user-email");
const premiumFeature = document.getElementById("premium-feature");
const normalFeature = document.getElementById("normal-feature");
const rzpBtn = document.getElementById("rzp-button");
const leaderbordBtn = document.getElementById("leaderboard-btn");
const leaderbordBtn2 = document.getElementById("leaderboard-btn2");
const userContainer = document.getElementById("user-container");
const downloadBtn = document.getElementById("download-btn");
const darkThemeBtn = document.getElementById("dark-theme-btn");
const showHistoryBtn = document.getElementById("download-history-btn");
const showHistoryBtn2 = document.getElementById("download-history-btn2");
const leaderboardHeading = document.getElementById("leaderboard-heading");
const historyHeading = document.getElementById("history-heading");
const flexContainer = document.getElementById("flex-container");
const paginationContainer = document.getElementById("pagination-container");
const leaderboardContainer = document.getElementById(
  "leaderboard-expense-container"
);

/////////////////////////////////////premium check////////////////////////////
(() => {
  const token = localStorage.getItem("sessionToken");
  axios
    .get("http://52.69.79.61:3000/user/premium-check", {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        if (response.data.isPremium) {
          const theme = localStorage.getItem("darkTheme");
          if (theme === "true" || theme === null) {
            darkTheme();
          } else {
            blueTheme();
          }
          enablePremium();
        } else {
          disablePremium();
        }
        userNameEle.innerText = response.data.userName
          .toLowerCase()
          .split(" ")
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(" ");
        userEmailEle.innerText = response.data.userEmail;
      }
    })
    .catch((err) => {
      console.log(err);
      notify(err.response.data);
    });
})();

////////////////////////////////togle dark theme////////////////////////////////
darkThemeBtn.addEventListener("click", (e) => {
  if (darkThemeBtn.firstElementChild.checked === false) {
    localStorage.setItem("darkTheme", true);
    darkTheme();
  } else {
    localStorage.setItem("darkTheme", false);
    blueTheme();
  }
});

//////////////////////////////////////enable////////////////////////////////////
function blueTheme() {
  darkThemeBtn.firstElementChild.checked = false;
  body.classList.remove("dark-theme");
  root.style.setProperty("--blue1", " rgb(249, 247, 247)");
  root.style.setProperty("--blue2", "rgb(219, 226, 239)");
  root.style.setProperty("--blue3", "rgb(63, 114, 175)");
  root.style.setProperty("--blue4", "rgb(17, 45, 78)");
}
function darkTheme() {
  darkThemeBtn.firstElementChild.checked = true;
  body.classList.add("dark-theme");
  root.style.setProperty("--blue1", "rgb(255, 255, 255)");
  root.style.setProperty("--blue2", "rgb(40, 42, 46)");
  root.style.setProperty("--blue3", "rgb(28, 29, 31)");
  root.style.setProperty("--blue4", "rgb(24, 25, 26)");
}

function enablePremium() {
  proEle.innerText = "pro";
  nav.style.visibility = "visible";
  premiumFeature.style.display = "flex";
  normalFeature.style.display = "none";
  leaderbordBtn.addEventListener("click", leaderbordHandler);
  leaderbordBtn2.addEventListener("click", leaderbordHandler);
  showHistoryBtn.addEventListener("click", showHistoryHandler);
  showHistoryBtn2.addEventListener("click", showHistoryHandler);
}

function leaderbordHandler() {
  const token = localStorage.getItem("sessionToken");
  axios
    .get(`http://52.69.79.61:3000/expense/leaderboard`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        removeActive();
        addExpenseContainer.style.display = "none";
        paginationContainer.style.display = "none";
        leaderboardContainer.innerText = "";
        userContainer.classList.remove("show-user");
        if (window.innerWidth >= 550) {
          flexContainer.style.transform = "translateX(-1650px)";
        } else {
          flexContainer.style.transform = "translateX(-300vw)";
        }
        display(true, false);
        response.data.userWiseExpense.forEach((userExpense) => {
          if (userExpense.id === response.data.userId) {
            showLeaderboard(userExpense, "background-color:#FF731D");
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

function showLeaderboard(leaderboardData, highlight) {
  const textNode = `<div class="expense-data-bar" style="${highlight}">
  <div class="bar">
    <div class="name">${leaderboardData.name}</div>
    <div class="total">${
      leaderboardData.userTotalExpense == null
        ? 0
        : leaderboardData.userTotalExpense
    } &#x20B9;</div>
  </div>
</div>`;
  leaderboardContainer.innerHTML += textNode;
}

downloadBtn.addEventListener("click", () => {
  downloadBtn.firstElementChild.className = "fa fa-spinner fa-pulse";
  const token = localStorage.getItem("sessionToken");
  axios
    .get(`http://52.69.79.61:3000/expense-file/download`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        location.href = response.data.fileURL;
      } else {
        throw { response: response };
      }
    })
    .catch((err) => {
      console.log(err);
      notify(err.response.data);
    })
    .finally(() => {
      downloadBtn.firstElementChild.className = "fa fa-download";
    });
});

function showHistoryHandler() {
  const token = localStorage.getItem("sessionToken");
  axios
    .get(`http://52.69.79.61:3000/expense-file/download-history`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        removeActive();
        addExpenseContainer.style.display = "none";
        paginationContainer.style.display = "none";
        leaderboardContainer.innerText = "";
        userContainer.classList.remove("show-user");
        if (window.innerWidth >= 550) {
          flexContainer.style.transform = "translateX(-1650px)";
        } else {
          flexContainer.style.transform = "translateX(-300vw)";
        }
        display(false, true);
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
}

function removeActive() {
  navBtns.forEach((btn) => {
    btn.classList.remove("active");
  });
}

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

function display(leaderboard, history) {
  if (leaderboard) {
    showHistoryBtn2.style.visibility = "visible";
    leaderboardHeading.style.display = "inline-block";
  } else {
    showHistoryBtn2.style.visibility = "hidden";
    leaderboardHeading.style.display = "none";
  }
  if (history) {
    leaderbordBtn2.style.visibility = "visible";
    historyHeading.style.display = "inline-block";
  } else {
    leaderbordBtn2.style.visibility = "hidden";
    historyHeading.style.display = "none";
  }
}

//////////////////////////////////////disable////////////////////////////////////
function disablePremium() {
  nav.style.visibility = "hidden";
  body.classList.remove("dark-theme");
  normalFeature.style.display = "block";
  premiumFeature.style.display = "none";
  createOrderId();
  rzpBtn.addEventListener("click", proceedToPay);
}

//creates new orderId everytime
function createOrderId() {
  const token = localStorage.getItem("sessionToken");
  axios
    .post(
      "http://52.69.79.61:3000/order/create-OrderId",
      {
        amount: "4900",
      },
      {
        timeout: 0,
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    )
    .then((response) => {
      if (response.status === 201) {
        rzpBtn.dataset.orderid = response.data.orderId;
      } else {
        throw { response: response };
      }
    })
    .catch((err) => {
      console.log(err);
      notify(err.response.data);
    });
}

function proceedToPay(e) {
  e.preventDefault();
  const options = {
    key: "rzp_test_NfEzOE4dgBCx9v", // Enter the Key ID generated from the Dashboard
    amount: "4900", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "Expense Manager Pro",
    description: "Access to Premium Features",
    image: "../images/512x512bb-modified.png",
    order_id: rzpBtn.dataset.orderid, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: function (response) {
      const token = localStorage.getItem("sessionToken");
      axios
        .post(
          "http://52.69.79.61:3000/order/verify",
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
            location.href = "./congratulation.html";
          } else {
            notify({
              type: "error",
              message: "Invalid Authentication Source! Try Again.",
            });
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
    notify({ type: "error", message: "Transaction Failed! Try Again." });
    // alert(response.error.code);
    // alert(response.error.description);
    // alert(response.error.source);
    // alert(response.error.step);
    // alert(response.error.reason);
    // alert(response.error.metadata.order_id);
    // alert(response.error.metadata.payment_id);
  });
  rzp.open();
}
