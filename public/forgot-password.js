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
  axios
    .post("http://localhost:3000/password/forgotpassword", {
      email: e.target.email.value,
    })
    .then((response) => {
      if (response.status === 200) {
        notify(response.data);
      } else {
        throw { response: response };
      }
    })
    .catch((err) => {
      notify(err.response.data);
      console.log(err);
    });
});
