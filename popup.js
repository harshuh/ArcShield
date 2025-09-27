document.querySelector(".lock-btn").addEventListener("click", () => {
  browser.windows.create({
    url: browser.runtime.getURL("extension.html"),
    type: "popup",
    width: 800,
    height: 600,
    focused: true,
  });
});
