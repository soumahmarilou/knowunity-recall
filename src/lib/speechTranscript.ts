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
 */

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
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
    const timer = setTimeout(() => {
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

      recognition.onerror = () => {
        setSupported(false);
      };

      try {
        recognition.start();
      } catch {
        setSupported(false);
      }
    }, 0);

    return () => {
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
