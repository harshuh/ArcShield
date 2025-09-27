document.querySelector(".lock-btn").addEventListener("click", () => {
  browser.windows.create({
    url: browser.runtime.getURL("extension.html"),
    type: "panel",
    width: 800,
    height: 600,
    focused: true,
  });
});

// document.addEventListener("DOMContentLoaded", () => {
//   const lockBtn = document.querySelector(".lock-btn");

//   if (lockBtn) {
//     lockBtn.addEventListener("click", () => {
//       browser.runtime.sendMessage({ action: "lock" });
//       window.close();
//     });
//   }
// });
