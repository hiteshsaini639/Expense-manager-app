const root = document.querySelector(":root");
(() => {
  const token = localStorage.getItem("sessionToken");
  axios
    .get("http://localhost:3000/user/premium-check", {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      if (response.status === 200 && response.data.isPremium) {
        root.style.setProperty("--blue1", "rgb(255, 255, 255)");
        root.style.setProperty("--blue2", "rgb(40, 42, 46)");
        root.style.setProperty("--blue3", "rgb(28, 29, 31)");
        root.style.setProperty("--blue4", "rgb(24, 25, 26)");
      }
    })
    .catch((err) => {
      console.log(err);
    });
})();
//dsfsdf
