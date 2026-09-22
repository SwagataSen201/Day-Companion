import { useEffect, useState } from "react";

/**
 * Current device/browser time, refreshed on an interval and whenever the app
 * is brought back to the foreground. Returns null until mounted (SSR-safe).
 */
export function useNow(intervalMs = 15_000) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const sync = () => setNow(new Date());
    sync();

    const interval = window.setInterval(sync, intervalMs);
    const onVisible = () => {
      if (!document.hidden) sync();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", sync);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", sync);
    };
  }, [intervalMs]);

  return now;
}
