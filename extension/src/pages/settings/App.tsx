import { useState } from 'react'
import { useRequireOnboarding } from '../../shared/useRequireOnboarding'
import { setArcShieldSettings, setArcShieldPin, type ArcShieldData } from '../../shared/arcShieldStorage'
import { AutoLockSection } from './AutoLockSection'
import { AccountSection } from './AccountSection'

export function App() {
  const guard = useRequireOnboarding()

  if (guard.status === 'checking' || guard.status === 'redirecting') {
    return (
      <div className="page">
        <p className="loading-text">Loading\u2026</p>
      </div>
    )
  }

  return <SettingsContent initialData={guard.data} />
}

function SettingsContent({ initialData }: { initialData: ArcShieldData }) {
  const [data, setData] = useState(initialData)

  async function handleSettingsChange(partial: Parameters<typeof setArcShieldSettings>[0]) {
    const nextSettings = await setArcShieldSettings(partial)
    setData((prev) => ({ ...prev, settings: nextSettings }))
  }

  async function handleResetPin(currentPin: string, newPin: string) {
    if (currentPin !== data.pin) {
      return { ok: false, error: 'Current PIN is incorrect.' }
    }
    await setArcShieldPin(newPin)
    setData((prev) => ({ ...prev, pin: newPin }))
    return { ok: true }
  }

  return (
    <div className="page page-settings">
      <div className="settings-container">
        <header className="settings-header">
          <p className="settings-eyebrow">ARC SHIELD</p>
          <h1 className="settings-heading">Settings</h1>
          <p className="step-subtitle">
            Press <kbd className="kbd">Ctrl+Shift+K</kbd> anywhere to lock all tabs instantly.
          </p>
        </header>

        <AutoLockSection settings={data.settings} onChange={handleSettingsChange} />
        <AccountSection email={data.email} onResetPin={handleResetPin} />
      </div>
    </div>
  )
}