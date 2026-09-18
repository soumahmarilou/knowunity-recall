"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Mic permission state, shared app-wide via localStorage — per
 * voice_recall_build_decisions.md: "once ever, app-wide... whichever of
 * the 3 modes the student first taps the mic in is where it happens;
 * never shown again after."
 *
 * This is a real permission flow, not a faked one: `requestMicPermission`
 * calls the browser's actual `getUserMedia`, which fires the real OS/
 * browser permission dialog. The resulting stream is stopped immediately
 * and never used for anything — CLAUDE.md's "no backend on the voice
 * recording" rule is about not processing or sending audio anywhere, not
 * about avoiding the real permission API. Using the real API means this
 * prototype exercises the actual one-shot-prompt behavior voice-ux.md's
 * Principle 3 describes, not an approximation of it.
 */

const STORAGE_KEY = "knowunity:mic-permission";

export type MicPermissionStatus = "unknown" | "granted" | "denied";

function readStoredStatus(): MicPermissionStatus {
  if (typeof window === "undefined") return "unknown";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "granted" || stored === "denied" ? stored : "unknown";
}

export function useMicPermission() {
  // Starts "unknown" on every render (server and first client render) to
  // avoid a hydration mismatch, then syncs from localStorage once mounted.
  const [status, setStatus] = useState<MicPermissionStatus>("unknown");

  useEffect(() => {
    setStatus(readStoredStatus());
  }, []);

  const requestMicPermission = useCallback(async (): Promise<MicPermissionStatus> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      window.localStorage.setItem(STORAGE_KEY, "granted");
      setStatus("granted");
      return "granted";
    } catch {
      // Any failure (denied, no hardware, unsupported) is treated as
      // "denied" for this prototype's purposes — the UI doesn't need to
      // distinguish the reason, only that voice isn't available.
      window.localStorage.setItem(STORAGE_KEY, "denied");
      setStatus("denied");
      return "denied";
    }
  }, []);

  return { status, requestMicPermission };
}
