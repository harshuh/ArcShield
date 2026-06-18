import { useState, type InputHTMLAttributes } from 'react'
import { PinInput } from './PinInput'

interface SetupFormProps {
  onComplete: (data: { email: string; password: string; pin: string }) => void
  submitting: boolean
  error: string | null
}

const MIN_PIN_LENGTH = 4
const MAX_PIN_LENGTH = 12

export function SetupForm({ onComplete, submitting, error }: SetupFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setValidationError(null)

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setValidationError('Enter a valid email address.')
      return
    }
    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords don\u2019t match.')
      return
    }
    if (pin.length < MIN_PIN_LENGTH || pin.length > MAX_PIN_LENGTH) {
      setValidationError(`PIN must be ${MIN_PIN_LENGTH}\u2013${MAX_PIN_LENGTH} digits.`)
      return
    }
    if (pin !== confirmPin) {
      setValidationError('PINs don\u2019t match.')
      return
    }

    onComplete({ email: email.trim(), password, pin })
  }

  const displayError = validationError ?? error

  return (
    <form className="setup-form" onSubmit={handleSubmit}>
      <div>
        <h1 className="step-title">Set up Arc Shield</h1>
        <p className="step-subtitle">
          Your PIN locks and unlocks your browser day to day. Your email and password are
          only used to recover access if you forget your PIN.
        </p>
      </div>

      <section className="form-section">
        <p className="form-section-label">Account recovery</p>
        <div className="field-stack">
          <Field
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
          <Field
            label="Recovery password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Field
            label="Confirm recovery password"
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </section>

      <section className="form-section">
        <p className="form-section-label">Browser lock</p>
        <div className="field-stack">
          <PinInput
            label="PIN"
            value={pin}
            onChange={setPin}
            minLength={MIN_PIN_LENGTH}
            maxLength={MAX_PIN_LENGTH}
            placeholder="Choose a PIN"
          />
          <PinInput
            label="Confirm PIN"
            value={confirmPin}
            onChange={setConfirmPin}
            minLength={MIN_PIN_LENGTH}
            maxLength={MAX_PIN_LENGTH}
            placeholder="Re-enter PIN"
          />
        </div>
      </section>

      {displayError && <p className="field-error">{displayError}</p>}

      <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
        {submitting ? 'Setting up\u2026' : 'Finish setup'}
      </button>
    </form>
  )
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

function Field({ label, ...inputProps }: FieldProps) {
  const id = label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input id={id} className="field-input" {...inputProps} />
    </div>
  )
}