(async () => {
  const currentUrl = window.location.href

  if (
    currentUrl.startsWith('chrome-extension://') ||
    currentUrl.startsWith('chrome://') ||
    currentUrl.startsWith('about:')
  ) {
    return
  }

  try {
    const result = await chrome.storage.local.get('arcshield:locked')
    if (result['arcshield:locked'] === true) {
      window.location.replace(chrome.runtime.getURL('lock.html'))
    }
  } catch {
    console.log("Harshuh")
  }
})()