const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (e.target.confirmPassword.value === e.target.newPassword.value) {
    axios
      .post("http://localhost:3000/password/new-password", {
        email: e.target.email.value,
        newPassword: e.target.newPassword.value,
      })
      .then((response) => {
        if (response.status === 200) {
          window.location.href = "http://localhost:3000/password-changed.html";
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
