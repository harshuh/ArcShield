import { useEffect, useState } from 'react'
import { IdleTab } from './IdleTab'
import { TabLockPanel } from './TabLockPanel'
import {
  getArcShieldData,
  setArcShieldSettings,
  type ArcShieldSettings,
} from '../../shared/arcShieldStorage'

type Tab = 'idle' | 'tabLock'

export function App() {
  const [tab, setTab] = useState<Tab>('idle')
  const [settings, setSettings] = useState<ArcShieldSettings | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    getArcShieldData().then((data) => setSettings(data.settings))
  }, [])

  async function handleApplyIdleMinutes(minutes: number) {
    const next = await setArcShieldSettings({ autoLockMinutes: minutes })
    setSettings(next)
  }

  async function handleApplyLockedUrl(url: string) {
    const next = await setArcShieldSettings({ lockedUrl: url })
    setSettings(next)
    return { ok: true }
  }

  async function handleLockBrowser() {
    try {
      await chrome.runtime.sendMessage({ type: 'LOCK_ALL_TABS' })
      setStatus('Lock requested \u2014 not yet implemented.')
    } catch (err) {
      setStatus('Could not reach the background worker.')
      console.error(err)
    }
  }

  function handleOpenSettings() {
    chrome.runtime.openOptionsPage()
  }

  return (
    <div>
      <div className="popup-header">
        <span className="popup-icon">
        </span>
        <p className="popup-title">Arc Shield</p>
      </div>

      <div className="popup-card">
        <div className="popup-tabs">
          <button
            className={`popup-tab ${tab === 'idle' ? 'popup-tab-active' : ''}`}
            onClick={() => setTab('idle')}
          >
            Idle
          </button>
          <button
            className={`popup-tab ${tab === 'tabLock' ? 'popup-tab-active' : ''}`}
            onClick={() => setTab('tabLock')}
          >
            Tab Lock
          </button>
        </div>

        {!settings ? (
          <p className="popup-status">Loading</p>
        ) : tab === 'idle' ? (
          <IdleTab initialMinutes={settings.autoLockMinutes} onApply={handleApplyIdleMinutes} />
        ) : (
          <TabLockPanel initialUrl={settings.lockedUrl} onApply={handleApplyLockedUrl} />
        )}
      </div>

      <div className="popup-actions">
        <button className="popup-action" onClick={handleOpenSettings}>
          Settings
        </button>

        <button className="popup-action popup-action-primary" onClick={handleLockBrowser}>
          Lock Browser
        </button>
      </div>

      {status && <p className="popup-status">{status}</p>}
    </div>
  )
}
