function handleUnlock() {
  const passwordInput = document.getElementById("unlock-password");
  const message = document.getElementById("message");
  const unlockBtn = document.getElementById("unlock-btn");

  const enteredPassword = passwordInput.value.trim();
  message.textContent = "";

  if (!enteredPassword) {
    message.style.color = "#ff8080";
    message.textContent = "Please enter your password.";
    return;
  }

  unlockBtn.disabled = true;

  browser.storage.local.get("password", (result) => {
    unlockBtn.disabled = false;

    if (result.password === enteredPassword) {
      message.style.color = "#bbf8dd";
      message.textContent = "Unlocked successfully!";

      setTimeout(() => {
        window.close();
      }, 1000);
    } else {
      message.style.color = "#ff8080";
      message.textContent = "Incorrect password!";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const unlockBtn = document.getElementById("unlock-btn");
  if (unlockBtn) {
    unlockBtn.addEventListener("click", handleUnlock);
  }
});
