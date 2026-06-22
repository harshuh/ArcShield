import { useEffect, useState } from "react";
import { IdleTab } from "./IdleTab";
import { TabLockPanel } from "./TabLockPanel";
import {
  getlmbData,
  setlmbSettings,
  type lmbSettings,
} from "../../shared/lmbStorage";

type Tab = "idle" | "tabLock";

export function App() {
  const [tab, setTab] = useState<Tab>("idle");
  const [settings, setSettings] = useState<lmbSettings | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    getlmbData().then((data) => setSettings(data.settings));
  }, []);

  async function handleApplyIdleMinutes(minutes: number) {
    const next = await setlmbSettings({ autoLockMinutes: minutes });
    setSettings(next);
  }

  async function handleApplyLockedUrl(url: string) {
    const next = await setlmbSettings({ lockedUrl: url });
    setSettings(next);
    return { ok: true };
  }

  async function handleLockBrowser() {
    try {
      await chrome.runtime.sendMessage({ type: "LOCK_ALL_TABS" });
      window.close();
    } catch (err) {
      setStatus("Could not lock. Please try again.");
      console.error(err);
    }
  }

  function handleOpenSettings() {
    chrome.runtime.openOptionsPage();
  }

  return (
    <div>
      <div className="popup-header">
        <span className="popup-icon"></span>
        <p className="popup-title">LockMyBrowser</p>
      </div>

      <div className="popup-card">
        <div className="popup-tabs">
          <button
            className={`popup-tab ${tab === "idle" ? "popup-tab-active" : ""}`}
            onClick={() => setTab("idle")}
          >
            Idle
          </button>
          <button
            className={`popup-tab ${tab === "tabLock" ? "popup-tab-active" : ""}`}
            onClick={() => setTab("tabLock")}
          >
            Tab Lock
          </button>
        </div>

        {!settings ? (
          <p className="popup-status">Loading</p>
        ) : tab === "idle" ? (
          <IdleTab
            initialMinutes={settings.autoLockMinutes}
            onApply={handleApplyIdleMinutes}
          />
        ) : (
          <TabLockPanel
            initialUrl={settings.lockedUrl}
            onApply={handleApplyLockedUrl}
          />
        )}
      </div>

      <div className="popup-actions">
        <button className="popup-action" onClick={handleOpenSettings}>
          Settings
        </button>

        <button
          className="popup-action popup-action-primary"
          onClick={handleLockBrowser}
        >
          Lock Browser
        </button>
      </div>

      {status && <p className="popup-status">{status}</p>}
    </div>
  );
}
