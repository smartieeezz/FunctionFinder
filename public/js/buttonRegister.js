const registerButton = document.getElementById("register-button");

registerButton.addEventListener("click", () => {
  if (registerButton.textContent === "Register") {
    registerButton.textContent = "Unregister";
  } else {
    registerButton.textContent = "Register";
  }
});