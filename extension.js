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

  browser.storage.local
    .get("password")
    .then((result) => {
      unlockBtn.disabled = false;

      if (result.password === enteredPassword) {
        message.style.color = "#bbf8ddff";
        message.textContent = "Unlocked successfully!";

        setTimeout(() => {
          // Close unlock page or open main extension page
          window.close();
        }, 1000);
      } else {
        message.style.color = "#ff8080";
        message.textContent = "Incorrect password!";
      }
    })
    .catch((error) => {
      unlockBtn.disabled = false;
      message.style.color = "#ff8080";
      message.textContent = "Error: " + error;
      console.error(error);
    });
}

document.getElementById("unlock-btn").addEventListener("click", handleUnlock);
