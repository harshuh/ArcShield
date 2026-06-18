import { useState } from 'react'

interface AccountSectionProps {
  email: string | null
  onResetPin: (currentPin: string, newPin: string) => Promise<{ ok: boolean; error?: string }>
}

export function AccountSection({ email, onResetPin }: AccountSectionProps) {
  return (
    <div className="settings-stack">
      <EmailCard email={email} />
      <ResetPinCard onResetPin={onResetPin} />
    </div>
  )
}

function EmailCard({ email }: { email: string | null }) {
  return (
    <section className="settings-card">
      <h2 className="settings-card-title">Recovery email</h2>
      <p className="settings-card-subtitle">Used if you ever need to recover your account.</p>
      <div className="readonly-field">{email ?? 'Not set'}</div>
    </section>
  )
}

function ResetPinCard({ onResetPin }: Pick<AccountSectionProps, 'onResetPin'>) {
  const MIN_PIN_LENGTH = 4
  const MAX_PIN_LENGTH = 12

  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function digitsOnly(raw: string) {
    return raw.replace(/\D/g, '').slice(0, MAX_PIN_LENGTH)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (newPin.length < MIN_PIN_LENGTH) {
      setError(`PIN must be at least ${MIN_PIN_LENGTH} digits.`)
      return
    }
    if (newPin !== confirmPin) {
      setError('PINs don\u2019t match.')
      return
    }

    setSubmitting(true)
    const result = await onResetPin(currentPin, newPin)
    setSubmitting(false)

    if (!result.ok) {
      setError(result.error ?? 'Could not reset your PIN.')
      return
    }

    setCurrentPin('')
    setNewPin('')
    setConfirmPin('')
    setSuccess(true)
  }

  return (
    <section className="settings-card">
      <h2 className="settings-card-title">Reset PIN</h2>
      <p className="settings-card-subtitle">Change the PIN you use to unlock your browser.</p>

      <form onSubmit={handleSubmit} className="field-stack reset-pin-form">
        <div className="field">
          <label htmlFor="current-pin" className="field-label">
            Current PIN
          </label>
          <input
            id="current-pin"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={currentPin}
            onChange={(e) => setCurrentPin(digitsOnly(e.target.value))}
            className="field-input"
          />
        </div>
        <div className="field">
          <label htmlFor="new-pin" className="field-label">
            New PIN
          </label>
          <input
            id="new-pin"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={newPin}
            onChange={(e) => setNewPin(digitsOnly(e.target.value))}
            className="field-input"
          />
        </div>
        <div className="field">
          <label htmlFor="confirm-new-pin" className="field-label">
            Confirm new PIN
          </label>
          <input
            id="confirm-new-pin"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={confirmPin}
            onChange={(e) => setConfirmPin(digitsOnly(e.target.value))}
            className="field-input"
          />
        </div>

        {error && <p className="field-error">{error}</p>}
        {success && <p className="field-success">PIN updated.</p>}

        <button type="submit" disabled={submitting} className="btn btn-primary btn-self-start">
          {submitting ? 'Updating\u2026' : 'Update PIN'}
        </button>
      </form>
    </section>
  )
}