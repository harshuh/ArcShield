interface SavedTab {
  id: number
  url: string
  windowId: number
  index: number
}

interface SavedWindow {
  id: number
  state: string
  tabs: SavedTab[]
}

const STORAGE_KEYS = {
  locked: 'arcshield:locked',
  lockWindowId: 'arcshield:lockWindowId',
  savedWindows: 'arcshield:savedWindows',
  pin: 'arcshield:pin',
  settings: 'arcshield:settings',
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: chrome.runtime.getURL('start.html') })
  }
})
// Re-show lock screen if browser was locked before closing
chrome.runtime.onStartup.addListener(async () => {
  const result = await chrome.storage.local.get(STORAGE_KEYS.locked)
  if (!result[STORAGE_KEYS.locked]) return

  const lockWin = await chrome.windows.create({
    url: chrome.runtime.getURL('lock.html'),
    type: 'popup',
    state: 'fullscreen',
    focused: true,
  })

  if (lockWin?.id) {
    await chrome.storage.local.set({ [STORAGE_KEYS.lockWindowId]: lockWin.id })
  }

  // Close any normal windows that opened on startup
  const allWindows = await chrome.windows.getAll()
  await Promise.all(
    allWindows
      .filter((w) => w.id !== lockWin?.id && w.type === 'normal')
      .map((w) => chrome.windows.remove(w.id!).catch(() => {}))
  )
})
async function applyIdleDetection() {
  const result = await chrome.storage.local.get(STORAGE_KEYS.settings)
  const settings = result[STORAGE_KEYS.settings] as
    | { autoLockEnabled: boolean; autoLockMinutes: number }
    | undefined
  if (settings?.autoLockEnabled) {
    const seconds = Math.max(60, (settings.autoLockMinutes ?? 5) * 60)
    chrome.idle.setDetectionInterval(seconds)
  }
}

chrome.idle.onStateChanged.addListener(async (state) => {
  if (state !== 'idle' && state !== 'locked') return
  const result = await chrome.storage.local.get([STORAGE_KEYS.locked, STORAGE_KEYS.settings])
  if (result[STORAGE_KEYS.locked]) return
  const settings = result[STORAGE_KEYS.settings] as { autoLockEnabled: boolean } | undefined
  if (!settings?.autoLockEnabled) return
  await lockBrowser()
})

async function lockBrowser() {
  const allWindows = await chrome.windows.getAll({ populate: true })

  const savedWindows: SavedWindow[] = allWindows
    .filter((w) => w.type === 'normal')
    .map((w) => ({
      id: w.id!,
      state: w.state ?? 'normal',
      tabs: (w.tabs ?? [])
        .filter((t) => t.url && !t.url.startsWith('chrome://') && !t.url.startsWith('about:'))
        .map((t) => ({
          id: t.id!,
          url: t.url!,
          windowId: t.windowId,
          index: t.index,
        })),
    }))

  // Navigate all tabs to blank to hide content
  const allTabs = savedWindows.flatMap((w) => w.tabs)
  await Promise.all(
    allTabs.map((t) =>
      chrome.tabs.update(t.id, { url: 'about:blank' }).catch(() => {})
    )
  )

  // Set locked state before opening lock window
  await chrome.storage.local.set({
    [STORAGE_KEYS.locked]: true,
    [STORAGE_KEYS.savedWindows]: savedWindows,
  })

  // Open fullscreen lock window
  const lockWin = await chrome.windows.create({
    url: chrome.runtime.getURL('lock.html'),
    type: 'popup',
    state: 'fullscreen',
    focused: true,
  })

  if (lockWin?.id) {
    await chrome.storage.local.set({ [STORAGE_KEYS.lockWindowId]: lockWin.id })
  }
}

async function enforceLockWindow() {
  const result = await chrome.storage.local.get([STORAGE_KEYS.locked, STORAGE_KEYS.lockWindowId])
  if (!result[STORAGE_KEYS.locked]) return

  const lockWindowId = result[STORAGE_KEYS.lockWindowId] as number | undefined

  // Close all normal windows that aren't the lock window
  const allWindows = await chrome.windows.getAll()
  await Promise.all(
    allWindows
      .filter((w) => w.id !== lockWindowId && w.type === 'normal')
      .map((w) => chrome.windows.remove(w.id!).catch(() => {}))
  )

  // Bring lock window back to focus and fullscreen
  if (lockWindowId) {
    await chrome.windows
      .update(lockWindowId, { focused: true, state: 'fullscreen' })
      .catch(() => {})
  }
}

chrome.windows.onCreated.addListener(async (window) => {
  const result = await chrome.storage.local.get([STORAGE_KEYS.locked, STORAGE_KEYS.lockWindowId])
  if (!result[STORAGE_KEYS.locked]) return
  if (window.id === result[STORAGE_KEYS.lockWindowId]) return
  if (window.type !== 'normal') return
  await enforceLockWindow()
})

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) return
  const result = await chrome.storage.local.get([STORAGE_KEYS.locked, STORAGE_KEYS.lockWindowId])
  if (!result[STORAGE_KEYS.locked]) return
  if (windowId === result[STORAGE_KEYS.lockWindowId]) return
  await enforceLockWindow()
})

// Secondary guards for tabs
chrome.tabs.onCreated.addListener(async (tab) => {
  const result = await chrome.storage.local.get(STORAGE_KEYS.locked)
  if (!result[STORAGE_KEYS.locked]) return
  if (tab.url?.startsWith('chrome-extension://')) return
  await chrome.tabs.update(tab.id!, { url: chrome.runtime.getURL('lock.html') }).catch(() => {})
})

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const result = await chrome.storage.local.get(STORAGE_KEYS.locked)
  if (!result[STORAGE_KEYS.locked]) return
  const tab = await chrome.tabs.get(activeInfo.tabId).catch(() => null)
  if (!tab || tab.url?.startsWith('chrome-extension://')) return
  await chrome.tabs.update(activeInfo.tabId, { url: chrome.runtime.getURL('lock.html') }).catch(() => {})
})

async function unlockBrowser() {
  const result = await chrome.storage.local.get([
    STORAGE_KEYS.lockWindowId,
    STORAGE_KEYS.savedWindows,
  ])

  const lockWindowId = result[STORAGE_KEYS.lockWindowId] as number | undefined
  const savedWindows = (result[STORAGE_KEYS.savedWindows] ?? []) as SavedWindow[]

  // Clear locked state first so content scripts stop redirecting
  await chrome.storage.local.set({ [STORAGE_KEYS.locked]: false })
  await chrome.storage.local.remove([STORAGE_KEYS.lockWindowId, STORAGE_KEYS.savedWindows])

  // Restore all saved tabs
  for (const win of savedWindows) {
    for (const tab of win.tabs) {
      await chrome.tabs.update(tab.id, { url: tab.url }).catch(async () => {
        await chrome.tabs.create({ windowId: win.id, url: tab.url }).catch(() => {})
      })
    }
    if (win.state && win.state !== 'minimized') {
      await chrome.windows
        .update(win.id, { state: win.state as chrome.windows.WindowState })
        .catch(() => {})
    }
  }

  // Close the lock window
  if (lockWindowId) {
    await chrome.windows.remove(lockWindowId).catch(() => {})
  }
}

// If a tab is activated while locked, redirect it to lock.html
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const result = await chrome.storage.local.get(STORAGE_KEYS.locked)
  if (!result[STORAGE_KEYS.locked]) return

  const tab = await chrome.tabs.get(activeInfo.tabId).catch(() => null)
  if (!tab) return
  if (tab.url?.startsWith('chrome-extension://')) return

  await chrome.tabs.update(activeInfo.tabId, {
    url: chrome.runtime.getURL('lock.html'),
  }).catch(() => {})
})

// If a new tab is opened while locked, redirect to lock.html
chrome.tabs.onCreated.addListener(async (tab) => {
  const result = await chrome.storage.local.get(STORAGE_KEYS.locked)
  if (!result[STORAGE_KEYS.locked]) return
  if (tab.url?.startsWith('chrome-extension://')) return

  await chrome.tabs.update(tab.id!, {
    url: chrome.runtime.getURL('lock.html'),
  }).catch(() => {})
})

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'LOCK_ALL_TABS') {
    lockBrowser()
      .then(() => sendResponse({ ok: true }))
      .catch((err) => sendResponse({ ok: false, error: String(err) }))
    return true
  }

  if (message?.type === 'UNLOCK') {
    unlockBrowser()
      .then(() => sendResponse({ ok: true }))
      .catch((err) => sendResponse({ ok: false, error: String(err) }))
    return true
  }

  return false
})

applyIdleDetection()