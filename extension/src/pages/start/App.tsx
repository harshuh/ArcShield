import { useState } from "react";
import { AboutStep } from "./AboutStep";
import { SetupForm } from "./SetupForm";
import { completeOnboarding } from "../../shared/lmbStorage";

type Screen = "about" | "form";

export function App() {
  const [screen, setScreen] = useState<Screen>("about");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleComplete(data: {
    email: string;
    password: string;
    pin: string;
  }) {
    setSubmitting(true);
    setError(null);

    try {
      await completeOnboarding(data);
      window.location.href = chrome.runtime.getURL("settings.html");
    } catch (err) {
      setError("Could not save your settings. Please try again.");
      console.error(err);
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="card">
        {screen === "about" && <AboutStep onNext={() => setScreen("form")} />}

        {screen === "form" && (
          <SetupForm
            onComplete={handleComplete}
            submitting={submitting}
            error={error}
          />
        )}
      </div>
    </div>
  );
}
