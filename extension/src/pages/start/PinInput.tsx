import { useState, type InputHTMLAttributes } from 'react'

interface PinInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: string
  value: string
  onChange: (value: string) => void
  minLength?: number
  maxLength?: number
}

export function PinInput({
  label,
  value,
  onChange,
  minLength = 4,
  maxLength = 12,
  id,
  ...inputProps
}: PinInputProps) {
  const [visible, setVisible] = useState(false)
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  function handleChange(raw: string) {
    const digitsOnly = raw.replace(/\D/g, '').slice(0, maxLength)
    onChange(digitsOnly)
  }

  return (
    <div className="field">
      <div className="field-label-row">
        <label htmlFor={inputId} className="field-label">
          {label}
        </label>
      </div>
      <div className="pin-input-wrap">
        <input
          id={inputId}
          type={visible ? 'text' : 'password'}
          inputMode="numeric"
          autoComplete="off"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="field-input pin-input"
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="pin-visibility-toggle"
          aria-label={visible ? 'Hide PIN' : 'Show PIN'}
          tabIndex={-1}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  )
}