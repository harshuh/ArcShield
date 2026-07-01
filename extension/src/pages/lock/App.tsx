import { useState } from "react";

type View = "pin" | "forgot";

export function App() {
  const [view, setView] = useState<View>("pin");

  return (
    <div className="lock-page">
      <div className="lock-card">
        <Brand />

        {view === "pin" ? (
          <PinView onForgot={() => setView("forgot")} />
        ) : (
          <ForgotView onBack={() => setView("pin")} />
        )}

        <Footer />
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="lock-brand">
      <div className="lock-brand-badge">
        <ShieldIcon />
      </div>
      <h1 className="lock-brand-mark">LockMyBrowser</h1>
    </div>
  );
}

function PinView({ onForgot }: { onForgot: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(raw: string) {
    setError(null);
    setPin(raw.replace(/\D/g, "").slice(0, 12));
  }

  async function handleUnlock() {
    if (submitting) return;
    if (!pin) {
      setError("Enter your PIN.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await chrome.runtime.sendMessage({ type: "UNLOCK", pin: pin });
      if (!response.ok) {
        setError(response.error || "Incorrect PIN. Try again.");
        setPin("");
      }
    } catch (err) {
      setError("Could not verify PIN. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !submitting) handleUnlock();
  }

  return (
    <div className="lock-panel">
      <p className="lock-panel-label">Pin</p>
      <input
        type="password"
        inputMode="numeric"
        autoComplete="off"
        autoFocus
        value={pin}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="lock-panel-input"
        placeholder="••••••••"
      />
      <div className="lock-panel-row">
        <button className="lock-link-button" onClick={onForgot}>
          Forget Pin
        </button>
      </div>
      {error && <p className="lock-error">{error}</p>}
      <div className="lock-panel-action">
        <button
          className="lock-unlock-btn"
          onClick={handleUnlock}
          disabled={submitting || !pin}
        >
          {submitting ? "Checking…" : "UNLOCK"}
        </button>
      </div>
    </div>
  );
}

function ForgotView({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function digitsOnly(raw: string) {
    return raw.replace(/\D/g, "").slice(0, 12);
  }

  async function handleResetPin() {
    setError(null);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPin.length < 4) {
      setError("PIN must be at least 4 digits.");
      return;
    }
    if (newPin !== confirmPin) {
      setError("PINs do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await chrome.runtime.sendMessage({
        type: "RESET_PIN_AND_UNLOCK",
        email: email.trim(),
        password: password,
        newPin: newPin,
      });

      if (!response.ok) {
        setError(response.error || "Reset failed. Please verify your credentials.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="lock-panel">
      <div className="lock-back-row">
        <button className="lock-link-button" onClick={onBack}>
          ← Back
        </button>
      </div>

      <p className="lock-panel-label">Recovery Email</p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="lock-panel-input"
        placeholder="you@example.com"
        autoComplete="off"
      />

      <p className="lock-panel-label">Recovery Password</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="lock-panel-input"
        placeholder="••••••••"
        autoComplete="off"
      />

      <p className="lock-panel-label">New PIN</p>
      <input
        type="password"
        inputMode="numeric"
        value={newPin}
        onChange={(e) => setNewPin(digitsOnly(e.target.value))}
        className="lock-panel-input"
        placeholder="••••"
        autoComplete="off"
      />

      <p className="lock-panel-label">Confirm New PIN</p>
      <input
        type="password"
        inputMode="numeric"
        value={confirmPin}
        onChange={(e) => setConfirmPin(digitsOnly(e.target.value))}
        className="lock-panel-input"
        placeholder="••••"
        autoComplete="off"
      />

      {error && <p className="lock-error">{error}</p>}

      <div className="lock-panel-action">
        <button
          className="lock-unlock-btn"
          onClick={handleResetPin}
          disabled={submitting || !email.trim() || !password || !newPin || !confirmPin}
        >
          {submitting ? "Resetting…" : "RESET PIN & UNLOCK"}
        </button>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="lock-footer">
      <a
        href="https://github.com/harshuh"
        target="_blank"
        rel="noreferrer"
        className="lock-footer-link"
      >
        Github
      </a>
      <a href="mailto:contact@lmb.in" className="lock-footer-link">
        Contact Us
      </a>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path
        d="M12 3 4 6v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V6l-8-3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
