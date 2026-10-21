"use client";

import { useState, useEffect } from "react";

export interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isExpired: boolean;
}

export function calculateTimeRemaining(expiresAt: string): TimeRemaining {
  const target = new Date(expiresAt).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, totalMs: 0, isExpired: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, totalMs: diff, isExpired: false };
}

interface UseCountdownProps {
  expiresAt: string;
  isClosed: boolean;
  onSimulateExpire: () => void;
}

export function useCountdown({ expiresAt, isClosed, onSimulateExpire }: UseCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(expiresAt)
  );

  useEffect(() => {
    if (isClosed) return;

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(expiresAt);
      setTimeLeft(remaining);

      if (remaining.isExpired) {
        clearInterval(interval);
        onSimulateExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, isClosed, onSimulateExpire]);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const closedState = isClosed || timeLeft.isExpired;

  return {
    timeLeft,
    closedState,
    pad,
  };
}
