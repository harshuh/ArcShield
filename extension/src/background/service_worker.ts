
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'LOCK_ALL_TABS') {
    console.log('[arc-shield] LOCK_ALL_TABS received not yet implemented.')
    sendResponse({ ok: true, implemented: false })
    return true
  }
  return false
})