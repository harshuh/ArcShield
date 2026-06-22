(async () => {
  const currentUrl = window.location.href;

  if (
    currentUrl.startsWith("chrome-extension://") ||
    currentUrl.startsWith("chrome://") ||
    currentUrl.startsWith("about:")
  ) {
    return;
  }

  try {
    const result = await chrome.storage.local.get("lmb:locked");
    if (result["lmb:locked"] === true) {
      window.location.replace(chrome.runtime.getURL("lock.html"));
    }
  } catch {
    console.log("Harshuh");
  }
})();
