import { useEffect, useState } from "react";
import { getlmbData, type lmbData } from "./lmbStorage";

type GuardState =
  | { status: "checking" }
  | { status: "redirecting" }
  | { status: "ready"; data: lmbData };

export function useRequireOnboarding() {
  const [state, setState] = useState<GuardState>({ status: "checking" });

  useEffect(() => {
    let cancelled = false;

    getlmbData().then((data) => {
      if (cancelled) return;
      if (!data.onboarded) {
        setState({ status: "redirecting" });
        window.location.href = chrome.runtime.getURL("start.html");
        return;
      }
      setState({ status: "ready", data });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
