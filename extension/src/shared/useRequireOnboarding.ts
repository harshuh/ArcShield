import { useEffect, useState } from 'react'
import { getArcShieldData, type ArcShieldData } from './arcShieldStorage'

type GuardState =
  | { status: 'checking' }
  | { status: 'redirecting' }
  | { status: 'ready'; data: ArcShieldData }

export function useRequireOnboarding() {
  const [state, setState] = useState<GuardState>({ status: 'checking' })

  useEffect(() => {
    let cancelled = false

    getArcShieldData().then((data) => {
      if (cancelled) return
      if (!data.onboarded) {
        setState({ status: 'redirecting' })
        window.location.href = chrome.runtime.getURL('start.html')
        return
      }
      setState({ status: 'ready', data })
    })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}