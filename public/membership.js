const root = document.querySelector(":root");
const proEle = document.getElementById("pro");
const proDependingEle = document.getElementById("pro-depending");
const userNameEle = document.getElementById("user-name");

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
        // proDependingEle.innerHTML =
        //   "<p>Compare your expense with others.</p><button id='leaderbord-btn'>LeaderBoard</button>";
      } else {
        proEle.remove();
        // proDependingEle.innerHTML =
        //   "<p>Bye Expense Manager Pro</p><button id='rzp-button'>Premium</button>";
      }
      userNameEle.innerText = response.data.userName;
    })
    .catch((err) => {
      console.log(err);
    });
})();
