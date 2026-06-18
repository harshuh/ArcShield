
export interface ArcShieldSettings {
  autoLockEnabled: boolean
  autoLockMinutes: number
  lockedUrl: string
}

export interface ArcShieldData {
  onboarded: boolean
  email: string | null
  recoveryPassword: string | null
  pin: string | null
  settings: ArcShieldSettings
}

export const DEFAULT_SETTINGS: ArcShieldSettings = {
  autoLockEnabled: true,
  autoLockMinutes: 5,
  lockedUrl: '',
}

const KEYS = {
  onboarded: 'arcshield:onboarded',
  email: 'arcshield:email',
  recoveryPassword: 'arcshield:recoveryPassword',
  pin: 'arcshield:pin',
  settings: 'arcshield:settings',
} as const

export async function getArcShieldData(): Promise<ArcShieldData> {
  const result = await chrome.storage.local.get([
    KEYS.onboarded,
    KEYS.email,
    KEYS.recoveryPassword,
    KEYS.pin,
    KEYS.settings,
  ])

  return {
    onboarded: Boolean(result[KEYS.onboarded]),
    email: (result[KEYS.email] as string | undefined) ?? null,
    recoveryPassword: (result[KEYS.recoveryPassword] as string | undefined) ?? null,
    pin: (result[KEYS.pin] as string | undefined) ?? null,
    settings: { ...DEFAULT_SETTINGS, ...(result[KEYS.settings] as Partial<ArcShieldSettings> | undefined) },
  }
}

export async function setArcShieldSettings(
  partial: Partial<ArcShieldSettings>
): Promise<ArcShieldSettings> {
  const current = await getArcShieldData()
  const next = { ...current.settings, ...partial }
  await chrome.storage.local.set({ [KEYS.settings]: next })
  return next
}

export async function setArcShieldPin(pin: string): Promise<void> {
  await chrome.storage.local.set({ [KEYS.pin]: pin })
}

export async function completeOnboarding(data: {
  email: string
  password: string
  pin: string
}): Promise<void> {
  await chrome.storage.local.set({
    [KEYS.onboarded]: true,
    [KEYS.email]: data.email,
    [KEYS.recoveryPassword]: data.password,
    [KEYS.pin]: data.pin,
  })
}