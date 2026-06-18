import { useState } from 'react'
import { AboutStep } from './AboutStep'
import { SetupForm } from './SetupForm'

type Screen = 'about' | 'form' | 'done'

export function App() {
  const [screen, setScreen] = useState<Screen>('about')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleComplete(data: { email: string; password: string; pin: string }) {
    setSubmitting(true)
    setError(null)

    try {
      // Frontend-only for now: persist setup completion locally.
      // NOTE: this stores the recovery password and PIN in plain form as a
      // placeholder. Before shipping, replace this with a hashed-credential
      // flow (see the Vaultline reference implementation) once the real
      // auth/background wiring for Arc Shield is in place.
      await chrome.storage.local.set({
        'arcshield:onboarded': true,
        'arcshield:email': data.email,
        'arcshield:recoveryPassword': data.password,
        'arcshield:pin': data.pin,
      })
      setScreen('done')
    } catch (err) {
      setError('Could not save your settings. Please try again.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <div className="card">
        {screen === 'about' && <AboutStep onNext={() => setScreen('form')} />}

        {screen === 'form' && (
          <SetupForm onComplete={handleComplete} submitting={submitting} error={error} />
        )}

        {screen === 'done' && <DoneStep />}
      </div>
    </div>
  )
}

function DoneStep() {
  return (
    <div className="step step-centered">
      <span className="success-badge">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h1 className="step-title">You're all set</h1>
      <p className="step-subtitle">
        Arc Shield is ready. Press <kbd className="kbd">Ctrl+Shift+K</kbd> any time to lock
        every open tab. Enter your PIN to unlock.
      </p>
    </div>
  )
}