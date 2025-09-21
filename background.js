function handleInstalled(details) {
  console.log(details.reason);
  browser.tabs.create({
    url: "start.html",
  });
}

browser.runtime.onInstalled.addListener(handleInstalled);
