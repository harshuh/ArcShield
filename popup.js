document.querySelector(".lock-btn").addEventListener("click", () => {
  chrome.windows.create({
    url: chrome.runtime.getURL("lock.html"),
    type: "popup",
    width: 400,
    height: 300,
    focused: true,
  });
});
