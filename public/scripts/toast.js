///////////////////////////////////notification///////////////////////////////
const toastContent = document.getElementById("toast-content");

function notify(notication) {
  let textContent;
  if (notication.type == "success") {
    textContent = `<i
      class="fa fa-check-circle fa-2x"
      aria-hidden="true"
      style="color: green"
    ></i>
    <div class="message">
      <span class="text text-1">Success</span>
      <span class="text text-2">${notication.message}</span>
    </div>`;
  } else {
    textContent = `<i
      class="fa fa-exclamation-circle fa-2x"
      aria-hidden="true"
      style="color: red"
    ></i>
    <div class="message">
      <span class="text text-1">Error</span>
      <span class="text text-2">${notication.message}</span>
    </div>`;
  }
  toastContent.innerHTML = textContent;
  toastContent.parentElement.classList.add("active");
  setTimeout(() => {
    toastContent.parentElement.classList.remove("active");
  }, 3000);
}
