const crossBtn = document.getElementById("cross-btn");
const addExpenseEle = document.querySelector(".add-expense");
const addExpenseContainer = document.getElementById("add-expense-container");
const form = document.querySelector("form");
const dailyExpenseContainer = document.getElementById(
  "daily-expense-container"
);
const yearlyExpenseContainer = document.getElementById(
  "yearly-expense-container"
);
const dateELe = document.querySelector(".date");
const monthELe = document.querySelector(".month");
const yearELe = document.querySelector(".year");
const dailyInfoBar = document.getElementById("daily-info-bar");
const monthlyInfoBar = document.getElementById("monthly-info-bar");
const yearlyInfoBar = document.getElementById("yearly-info-bar");
const monthlySum = document.getElementById("monthly-sum");
const dailySum = document.getElementById("daily-sum");
const userBtn = document.getElementById("user-btn");
const pageInfo = document.getElementById("page-info");
const pageBtns = document.querySelector(".page-btns");
const pageLeftBtn = document.getElementById("page-btn-left");
const pageRightBtn = document.getElementById("page-btn-right");
const rowsPerPageInput = document.getElementById("rows-per-page");

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

crossBtn.addEventListener("click", () => {
  crossBtn.classList.toggle("rotate");
  addExpenseEle.classList.toggle("scale");
});

document.documentElement.addEventListener("click", (e) => {
  if (!e.target.closest("#add-expense-container")) {
    addExpenseEle.classList.remove("scale");
  }
  if (!e.target.closest("#user-container")) {
    userContainer.classList.remove("show-user");
  }
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
      pageBtns.id = 1;
      loadDailyExpenseData(dateELe.id, 1);
      addExpenseContainer.style.display = "block";
      paginationContainer.style.display = "block";
    } else {
      addExpenseContainer.style.display = "none";
      paginationContainer.style.display = "none";
    }
    if (e.target.id === "1") {
      loadMonthlyExpenseData(0);
    }
    if (e.target.id === "2") {
      loadYearlyExpenseData(0);
    }
  }
});

dailyInfoBar.addEventListener("click", (e) => {
  if (e.target.closest(".left-btn")) {
    pageBtns.id = 1;
    dateELe.id -= 1;
    loadDailyExpenseData(dateELe.id, 1);
  }
  if (e.target.closest(".right-btn")) {
    pageBtns.id = 1;
    dateELe.id = +dateELe.id + 1;
    loadDailyExpenseData(dateELe.id, 1);
  }
});

window.addEventListener("DOMContentLoaded", loadExpenseData);

function loadExpenseData() {
  loadDailyExpenseData(0, 1);
  pageBtns.id = 1;
}

rowsPerPageInput.addEventListener("change", (e) => {
  localStorage.setItem("rowsPerPage", e.target.value);
  loadDailyExpenseData(dateELe.id, pageBtns.id);
});

pageRightBtn.addEventListener("click", () => {
  pageBtns.id = +pageBtns.id + 1;
  loadDailyExpenseData(dateELe.id, pageBtns.id);
});

pageLeftBtn.addEventListener("click", () => {
  pageBtns.id -= 1;
  loadDailyExpenseData(dateELe.id, pageBtns.id);
});

function loadDailyExpenseData(dateNumber, page) {
  let rows = localStorage.getItem("rowsPerPage");
  if (rows == null) rows = 5;
  rowsPerPageInput.value = rows;
  const token = localStorage.getItem("sessionToken");
  axios
    .get(
      `http://localhost:3000/expense/get-by-date?dateNumber=${dateNumber}&page=${page}&rows=${rows}`,
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((response) => {
      if (response.status === 200) {
        const { actualRows, expenses, date, totalAndCount } = response.data;
        dailyExpenseContainer.innerText = "";
        dateELe.innerText = date;
        if (totalAndCount.total) {
          dailySum.innerText = totalAndCount.total;
        } else {
          dailySum.innerText = 0;
        }
        expenses.forEach((expense) => {
          showDailyExpense(expense);
        });
        showPaginationInfo(page, rows, actualRows, totalAndCount.count);
      } else {
        throw { response: response };
      }
    })
    .catch((err) => {
      console.log(err);
      notify(err.response.data);
    });
}

// show output on frontend
function showDailyExpense(expenseData) {
  const textNode = `<div class="expense-data-bar">
  <div class="bar">
    <button class="des-btn">${expenseData.category}</button>
    <div class="amount">${expenseData.amount} &#x20B9;</div>
    <button class="delete-btn" id="${expenseData.id}">Delete</button>
  </div>
  <div class="description" id="des">${expenseData.description}</div>
</div>`;
  dailyExpenseContainer.innerHTML += textNode;
}

function showPaginationInfo(page, rows, actualRows, totalCount) {
  const offset = (page - 1) * rows;
  const lastRow = offset + actualRows;
  pageInfo.innerText = `${offset + 1}-${lastRow} of ${totalCount}`;
  pageRightBtn.disabled = !(lastRow < totalCount);
  pageLeftBtn.disabled = page == 1;
}

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

function showYearlyExpense(monthData) {
  const textNode = `<div class="expense-data-bar">
  <div class="bar">
  <div class="total-by">${months[monthData.month]}</div>
  <div class="monthly-total">${monthData.monthlySum} &#x20B9;</div>
  </div>
  </div>`;
  yearlyExpenseContainer.innerHTML += textNode;
}

dailyExpenseContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const token = localStorage.getItem("sessionToken");
    axios
      .delete(`http://localhost:3000/expense/delete/${e.target.id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          notify(response.data);
          e.target.parentElement.parentElement.remove();
        }
      })
      .catch((err) => {
        console.log(err);
        notify(err.response.data);
      });
  }
});

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
        dailySum.innerHTML = "<i class='fa fa-refresh' aria-hidden='true'></i>";
        e.target.category.value = "";
        e.target.amount.value = "";
        e.target.description.value = "";
      } else {
        throw { response: response };
      }
    })
    .catch((err) => {
      console.log(err);
      notify(err.response.data);
    });
});
