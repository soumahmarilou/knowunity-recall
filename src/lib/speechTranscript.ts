"use client";

import { useEffect, useRef, useState } from "react";
import { useMockTranscript } from "./mockTranscript";

/**
 * Real, live transcript of what the student is actually saying, via the
 * browser's native Web Speech API (`SpeechRecognition`) — per direct
 * instruction, this is a deliberate, disclosed exception to this
 * prototype's own "no speech-to-text" rule (see CLAUDE.md's own note on
 * it). It's not a backend or model call this app makes itself — a
 * browser-native capability, the same category as the already-real
 * `getUserMedia` this app already uses for the mic permission flow, not
 * the kind of judging/analysis backend the original rule was guarding
 * against.
 *
 * Falls back to the existing scripted `useMockTranscript` when the API
 * isn't available (Firefox and Safari don't support it as of this
 * writing) or fails to start — so the visual "something is being heard"
 * effect still works everywhere, just without real words on unsupported
 * browsers, rather than showing nothing at all.
 *
 * Known Chrome footgun this hook now guards against: even with
 * `continuous = true`, Chrome can end a recognition session on its own
 * (documented behavior — most commonly after a stretch of silence before
 * any speech is detected, or after roughly a minute of continuous use)
 * without ever firing `onerror`. Before this fix there was no `onend`
 * handler at all, so when that happened the transcript would go
 * permanently blank for the rest of the screen — `supported` never flips
 * to `false` (no error fired), so the mock fallback below never kicks in
 * either, it's just silent. A student pausing to think before speaking
 * (more common on Concept Questions' "repeat the answer" prompt and Free
 * Recall Challenge's "gather your thoughts" prompt than on Guided
 * Reflection's more free-flowing talk) is a plausible trigger for this,
 * though it wasn't reproducible in an automated/no-real-audio test
 * environment — this is a defensive fix for a real API behavior, not one
 * confirmed against the exact reported symptom. Fixed by listening for
 * `onend` and restarting recognition (up to a small retry budget) while
 * this hook is still `active`.
 */

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionErrorEventLike {
  error: string;
}
interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useSpeechTranscript(active: boolean): string {
  const [liveText, setLiveText] = useState("");
  const [supported, setSupported] = useState(true);
  const finalTextRef = useRef("");

  useEffect(() => {
    if (!active) {
      setLiveText("");
      finalTextRef.current = "";
      return;
    }

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setSupported(false);
      return;
    }

    let recognition: SpeechRecognitionLike | null = null;
    let stoppedByCleanup = false;
    let gaveUp = false;
    let restartCount = 0;
    // Generous — a single recording can span several of the browser's own
    // silence-timeout cycles (e.g. a long pause while the student thinks
    // before repeating an answer) without this actually being a failure.
    const MAX_RESTARTS = 6;
    // Worth giving up on immediately, never worth retrying — a retry loop
    // against "the student (or this OS) said no" just spins forever.
    const PERMANENT_ERRORS = new Set(["not-allowed", "service-not-allowed", "language-not-supported"]);

    function startRecognition() {
      if (!Ctor) return;
      recognition = new Ctor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let interim = "";
        let final = finalTextRef.current;
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            final += `${result[0].transcript} `;
          } else {
            interim += result[0].transcript;
          }
        }
        finalTextRef.current = final;
        setLiveText(`${final}${interim}`.trim());
      };

      recognition.onerror = (event) => {
        if (PERMANENT_ERRORS.has(event.error)) {
          gaveUp = true;
          setSupported(false);
        }
        // Transient errors (network hiccup, no-speech, aborted,
        // audio-capture) are left for `onend` below — Chrome always fires
        // `end` right after `error`, and that's where the actual
        // restart-or-give-up call happens, so it isn't duplicated here.
      };

      // Chrome can end a recognition session on its own — most reliably
      // after a stretch of silence before any speech arrives — even with
      // `continuous: true`, and without ever calling `onerror`. Without
      // this handler the transcript just goes permanently blank for the
      // rest of the screen once that happens, which reads as "doesn't
      // work" rather than as the single dropped segment it actually is.
      recognition.onend = () => {
        if (stoppedByCleanup || gaveUp) return;
        if (restartCount >= MAX_RESTARTS) {
          setSupported(false);
          return;
        }
        restartCount += 1;
        try {
          recognition?.start();
        } catch {
          setSupported(false);
        }
      };

      try {
        recognition.start();
      } catch {
        setSupported(false);
      }
    }

    // React's Strict Mode double-invokes this effect in dev (mount,
    // cleanup, mount again) synchronously, to catch effects that don't
    // clean up properly. SpeechRecognition is a genuinely stateful
    // browser API, not a React-friendly one: starting a second instance
    // while the first is still mid-teardown from that synchronous
    // cleanup throws a real "recognition has already started" error in
    // Chrome, which silently tripped the mock fallback below — the
    // actual regression behind "transcription doesn't work anymore".
    // Deferring the real `.start()` past the current task means the
    // throwaway first mount's cleanup fires before it ever calls start,
    // so there's nothing left for the second (real) mount to collide
    // with.
    const timer = setTimeout(startRecognition, 0);

    return () => {
      stoppedByCleanup = true;
      clearTimeout(timer);
      try {
        recognition?.stop();
      } catch {
        // Already stopped, or never actually started — nothing to do.
      }
    };
  }, [active]);

  const mockText = useMockTranscript(active && !supported);

  return supported ? liveText : mockText;
}
