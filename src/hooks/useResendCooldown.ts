import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Resend cooldown hook. Call `start(seconds)` to begin a countdown.
 * `seconds` is the remaining time, `isActive` is true while > 0.
 */
export function useResendCooldown(defaultSeconds = 30) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback((s: number = defaultSeconds) => {
    clear();
    setSeconds(s);
    intervalRef.current = window.setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clear();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clear, defaultSeconds]);

  useEffect(() => clear, [clear]);

  return { seconds, isActive: seconds > 0, start };
}

export default useResendCooldown;