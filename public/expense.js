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
const flexContainer = document.getElementById("flex-container");
const dateELe = document.querySelector(".date");
const monthELe = document.querySelector(".month");
const yearELe = document.querySelector(".year");
const dailyInfoBar = document.getElementById("daily-info-bar");
const monthlyInfoBar = document.getElementById("monthly-info-bar");
const yearlyInfoBar = document.getElementById("yearly-info-bar");
const monthlySum = document.getElementById("monthly-sum");
const dailySum = document.getElementById("daily-sum");

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

function removeActive() {
  navBtns.forEach((btn) => {
    btn.classList.remove("active");
  });
}

// show output on frontend
function showDailyExpense(expenseData) {
  const createTextNode = `<div class="expense-data-bar">
  <div class="bar">
    <button class="des-btn">${expenseData.category}</button>
    <div class="amount">${expenseData.amount}&nbsp;&#8360;</div>
    <div class="bar-btns">
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </div>
  </div>
  <div class="description" id="des">${expenseData.description}</div>
</div>`;
  dailyExpenseContainer.innerHTML += createTextNode;
}

function showYearlyExpense(monthData) {
  const createTextNode = `<div class="expense-data-bar">
  <div class="bar">
    <div class="total-by">${months[monthData.month]}</div>
    <div class="monthly-total">${monthData.monthlySum}&nbsp;&#8360;</div>
  </div>
</div>`;
  yearlyExpenseContainer.innerHTML += createTextNode;
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
}

function loadDailyExpenseData(dateNumber) {
  axios
    .get(`http://localhost:3000/expense/get-by-date?dateNumber=${dateNumber}`)
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
  axios
    .get(
      `http://localhost:3000/expense/get-by-month?monthNumber=${monthNumber}`
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
  axios
    .get(`http://localhost:3000/expense/get-by-year?yearNumber=${yearNumber}`)
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
  axios
    .post("http://localhost:3000/expense/add", {
      category: e.target.category.value,
      amount: e.target.amount.value,
      description: e.target.description.value,
    })
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
