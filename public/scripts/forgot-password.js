const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  axios
    .post("http://localhost:3000/password/forgotpassword", {
      email: e.target.email.value,
    })
    .then((response) => {
      if (response.status === 200) {
        notify(response.data);
        e.target.email.value = "";
      } else {
        throw { response: response };
      }
    })
    .catch((err) => {
      console.log(err);
      notify(err.response.data);
    });
});
