// Open start.html on install
browser.runtime.onInstalled.addListener(() => {
  browser.tabs.create({ url: "start.html" });
});

// Enforce lock on tab updates
async function enforceLock(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    const { locked } = await browser.storage.local.get("locked");
    const lockUrl = browser.runtime.getURL("extension.html");

    if (locked && tab.url !== lockUrl) {
      browser.tabs.update(tabId, { url: lockUrl });
    }
  }
}

browser.tabs.onUpdated.addListener(enforceLock);

browser.tabs.onCreated.addListener(async (tab) => {
  const { locked } = await browser.storage.local.get("locked");
  const lockUrl = browser.runtime.getURL("extension.html");
  if (locked) {
    browser.tabs.update(tab.id, { url: lockUrl });
  }
});

// Lock browser function
async function lockBrowser() {
  await browser.storage.local.set({ locked: true });

  // Get all windows
  const windows = await browser.windows.getAll();
  const currentWin = await browser.windows.getCurrent();

  // Close all windows except current
  for (const win of windows) {
    if (win.id !== currentWin.id) {
      browser.windows.remove(win.id);
    }
  }

  // Replace all tabs in current window with extension.html
  const lockUrl = browser.runtime.getURL("extension.html");
  const tabs = await browser.tabs.query({ windowId: currentWin.id });
  for (const tab of tabs) {
    browser.tabs.update(tab.id, { url: lockUrl });
  }

  // Maximize / fullscreen the window
  browser.windows.update(currentWin.id, { state: "fullscreen" });
}

// Listen for messages from popup.js
browser.runtime.onMessage.addListener((msg) => {
  if (msg.action === "lock") {
    lockBrowser();
  }
});
