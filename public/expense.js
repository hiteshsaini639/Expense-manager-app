const navBtns = document.querySelectorAll(".nav-btn");
const nav = document.getElementById("nav");
const crossBtn = document.getElementById("cross-btn");
const addExpenseEle = document.querySelector(".add-expense");
const msg = document.querySelector(".msg");
const form = document.querySelector("form");
const expenseContainer = document.getElementById("expense-container");

crossBtn.addEventListener("click", () => {
  crossBtn.classList.toggle("rotate");
  addExpenseEle.classList.toggle("scale");
});

expenseContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("des-btn")) {
    e.target.parentElement.nextElementSibling.classList.toggle("show");
  }
});

nav.addEventListener("click", (e) => {
  if (e.target.classList.contains("nav-btn")) {
    removeActive();
    e.target.classList.add("active");
  }
});

function removeActive() {
  navBtns.forEach((btn) => {
    btn.classList.remove("active");
  });
}

// show output on frontend
function showData(expenseData) {
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
  expenseContainer.innerHTML += createTextNode;
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
  axios
    .get("http://localhost:3000/expense/get")
    .then((response) => {
      if (response.status === 200) {
        response.data.forEach((expense) => {
          showData(expense);
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
        showData(response.data.expense);
      } else {
        throw { response: response };
      }
    })
    .catch((err) => {
      console.log(err);
      notify(err.response.data);
    });
});
