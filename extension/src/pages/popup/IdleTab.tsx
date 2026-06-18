import { useState } from 'react'
import { IdleSlider } from './IdleSlider'

interface IdleTabProps {
  initialMinutes: number
  onApply: (minutes: number) => Promise<void>
}

export function IdleTab({ initialMinutes, onApply }: IdleTabProps) {
  const [minutes, setMinutes] = useState(initialMinutes)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)

  async function handleApply() {
    setApplying(true)
    setApplied(false)
    await onApply(minutes)
    setApplying(false)
    setApplied(true)
  }

  return (
    <div className="tab-panel">
      <IdleSlider minutes={minutes} onChange={setMinutes} />
      <button className="btn btn-primary btn-full" onClick={handleApply} disabled={applying}>
        {applying ? 'Applying\u2026' : applied ? 'Applied' : 'Apply'}
      </button>
    </div>
  )
}