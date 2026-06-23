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
      const result = await chrome.storage.local.get("lmb:pin");
      const savedPin = result["lmb:pin"] as string | undefined;

      if (!savedPin || pin !== savedPin) {
        setError("Incorrect PIN. Try again.");
        setPin("");
      } else {
        await chrome.runtime.sendMessage({ type: "UNLOCK" });
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
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSendLink() {
    setError(null);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    setSending(true);

    try {
      const result = await chrome.storage.local.get("lmb:email");
      const savedEmail = result["lmb:email"] as string | undefined;

      if (
        !savedEmail ||
        email.trim().toLowerCase() !== savedEmail.toLowerCase()
      ) {
        setError("This email doesn\u2019t match the one you registered with.");
        setSending(false);
        return;
      }
      setSent(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="lock-panel">
      <div className="lock-back-row">
        <button className="lock-link-button" onClick={onBack}>
          ← Back
        </button>
      </div>

      <p className="lock-panel-label">Email</p>
      <input
        type="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="lock-panel-input lock-panel-input-email"
        placeholder="you@example.com"
      />

      {error && <p className="lock-error">{error}</p>}
      {sent && (
        <p className="lock-success">
          Link sent! Check your inbox to reset your PIN.
        </p>
      )}

      {!sent && (
        <div className="lock-panel-action">
          <button
            className="lock-send-btn"
            onClick={handleSendLink}
            disabled={sending || !email.trim()}
          >
            {sending ? "Sending…" : "Send Link"}
          </button>
        </div>
      )}
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
