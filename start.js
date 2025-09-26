function handleSavePassword() {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const message = document.getElementById("message");
  const spinner = document.getElementById("spinner");
  const saveBtn = document.getElementById("save-btn");

  const trimName = name.value.trim();
  const trimEmail = email.value.trim();

  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  message.textContent = "";

  if (!name || !email) {
    message.style.color = "#ff8080";
    message.textContent = "Please fill in both fields.";
    return;
  }

  if (!password || !confirmPassword) {
    message.style.color = "#ff8080";
    message.textContent = "Please fill in both fields.";
    return;
  }

  if (password !== confirmPassword) {
    message.style.color = "#ff8080";
    message.textContent = "Passwords do not match!";
    return;
  }

  saveBtn.disabled = true;
  spinner.style.display = "block";

  browser.storage.local
    .set({ password })
    .then(() => {
      spinner.style.display = "none";
      saveBtn.disabled = false;
      message.style.color = "#00ff90";
      message.textContent = "Password set successfully!";

      setTimeout(() => {
        window.close();
      }, 1000);
    })
    .catch((error) => {
      spinner.style.display = "none";
      saveBtn.disabled = false;
      message.style.color = "#ff8080";
      message.textContent = "Error saving password: " + error;
      console.error(error);
    });
}

document
  .getElementById("save-btn")
  .addEventListener("click", handleSavePassword);
