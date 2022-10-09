const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  axios
    .post("http://52.69.79.61:3000/user/login", {
      email: e.target.email.value,
      password: e.target.password.value,
    })
    .then((response) => {
      if (response.status === 200) {
        localStorage.setItem("sessionToken", response.data.sessionToken);
        window.location.href = "./expense.html";
      } else {
        throw { response: response };
      }
    })
    .catch((err) => {
      notify(err.response.data);
      console.log(err);
    });
});
