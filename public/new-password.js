const msg = document.querySelector(".msg");
const form = document.querySelector("form");

//show msg function
function notify(notication) {
  msg.textContent = notication.message;
  msg.classList.add(notication.type);
  setTimeout(() => {
    msg.classList.remove(notication.type);
    msg.textContent = "";
  }, 2000);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (e.target.confirmPassword.value === e.target.newPassword.value) {
    axios
      .post("http://localhost:3000/password/new-password", {
        newPassword: e.target.newPassword.value,
      })
      .then((response) => {
        if (response.status === 200) {
          notify(response.data);
          window.location.href = "./index.html";
        } else {
          throw { response: response };
        }
      })
      .catch((err) => {
        notify(err.response.data);
        console.log(err);
      });
  } else {
    notify({ type: "error", message: "Password does not Match!" });
  }
});
