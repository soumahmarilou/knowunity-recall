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
    const stored = readStoredStatus();
    setStatus(stored);

    // The cached "granted" flag can go stale — revoked in OS/browser
    // settings after the fact, or carried over from a different device/
    // profile via synced localStorage — and this hook otherwise trusts it
    // blindly, sending the student straight to a Recording screen where
    // both the live transcript and the waveform silently do nothing
    // (both `useSpeechTranscript` and `useMicLevel` degrade quietly on a
    // real getUserMedia failure, by design, rather than erroring loudly).
    // Re-verified here against the browser's real current permission via
    // the Permissions API where it's supported (Chrome/Edge; Safari and
    // Firefox don't support the "microphone" descriptor and throw, caught
    // below — the cached value is the only thing to go on there, same as
    // before this fix). Only ever *downgrades* a stale "granted" back to
    // "unknown" (re-triggering the primer honestly) — never silently
    // promotes to "granted" on its own, since actually obtaining
    // permission still has to go through the real OS prompt via
    // `requestMicPermission`.
    if (stored !== "granted" || typeof navigator === "undefined" || !navigator.permissions?.query) {
      return;
    }
    let cancelled = false;
    navigator.permissions
      .query({ name: "microphone" as PermissionName })
      .then((result) => {
        if (cancelled) return;
        if (result.state !== "granted") {
          window.localStorage.removeItem(STORAGE_KEY);
          setStatus("unknown");
        }
      })
      .catch(() => {
        // Permissions API doesn't support "microphone" on this browser —
        // nothing more reliable to check against, leave the cached value.
      });
    return () => {
      cancelled = true;
    };
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
