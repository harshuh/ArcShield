export interface lmbSettings {
  autoLockEnabled: boolean;
  autoLockMinutes: number;
  lockedUrl: string;
}

export interface lmbData {
  onboarded: boolean;
  email: string | null;
  recoveryPassword: string | null;
  pin: string | null;
  settings: lmbSettings;
}

export const DEFAULT_SETTINGS: lmbSettings = {
  autoLockEnabled: true,
  autoLockMinutes: 5,
  lockedUrl: "",
};

const KEYS = {
  onboarded: "lmb:onboarded",
  email: "lmb:email",
  recoveryPassword: "lmb:recoveryPassword",
  pin: "lmb:pin",
  settings: "lmb:settings",
} as const;

export async function getlmbData(): Promise<lmbData> {
  const result = await chrome.storage.local.get([
    KEYS.onboarded,
    KEYS.email,
    KEYS.recoveryPassword,
    KEYS.pin,
    KEYS.settings,
  ]);

  return {
    onboarded: Boolean(result[KEYS.onboarded]),
    email: (result[KEYS.email] as string | undefined) ?? null,
    recoveryPassword:
      (result[KEYS.recoveryPassword] as string | undefined) ?? null,
    pin: (result[KEYS.pin] as string | undefined) ?? null,
    settings: {
      ...DEFAULT_SETTINGS,
      ...(result[KEYS.settings] as Partial<lmbSettings> | undefined),
    },
  };
}

export async function setlmbSettings(
  partial: Partial<lmbSettings>,
): Promise<lmbSettings> {
  const current = await getlmbData();
  const next = { ...current.settings, ...partial };
  await chrome.storage.local.set({ [KEYS.settings]: next });
  return next;
}

export async function setlmbPin(pin: string): Promise<void> {
  await chrome.storage.local.set({ [KEYS.pin]: pin });
}

export async function completeOnboarding(data: {
  email: string;
  password: string;
  pin: string;
}): Promise<void> {
  await chrome.storage.local.set({
    [KEYS.onboarded]: true,
    [KEYS.email]: data.email,
    [KEYS.recoveryPassword]: data.password,
    [KEYS.pin]: data.pin,
  });
}
