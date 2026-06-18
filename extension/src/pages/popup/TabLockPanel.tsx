import { useState } from 'react'

interface TabLockPanelProps {
  initialUrl: string
  onApply: (url: string) => Promise<{ ok: boolean; error?: string }>
}

export function TabLockPanel({ initialUrl, onApply }: TabLockPanelProps) {
  const [url, setUrl] = useState(initialUrl)
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [applied, setApplied] = useState(false)

  async function handleApply() {
    setError(null)
    setApplied(false)

    if (!url.trim()) {
      setError('Enter a URL to lock.')
      return
    }

    setApplying(true)
    const result = await onApply(url.trim())
    setApplying(false)

    if (!result.ok) {
      setError(result.error ?? 'Could not save this site.')
      return
    }
    setApplied(true)
  }

  return (
    <div className="tab-panel">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL to be locked"
        className="field-input"
      />
      {error && <p className="field-error">{error}</p>}
      <button className="btn btn-primary btn-full" onClick={handleApply} disabled={applying}>
        {applying ? 'Applying\u2026' : applied ? 'Applied' : 'Apply'}
      </button>
    </div>
  )
}