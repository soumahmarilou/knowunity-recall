"use client";

import { useEffect, useRef } from "react";
import styles from "./TranscriptView.module.css";

/**
 * Live, scrollable transcript view for an active recording — per direct
 * instruction, styled after song-lyrics views (Apple Music named as the
 * reference): content that overflows the box fades out at the top and
 * bottom edges (a mask-image gradient, not a real blur — cheaper, and
 * reads the same) instead of being cut off sharply, and auto-scrolls to
 * keep the newest text in view as it grows.
 *
 * Not a Figma component — no frame or design-system entry exists for
 * this, since it's a new feature this session, not a ported one. Built
 * as a real component from the start (not inlined per screen) since it's
 * needed on every mode's Recording screen at once, not a one-off.
 *
 * The text itself is supplied by the caller (`useSpeechTranscript`, real
 * words via the browser's Web Speech API where supported, falling back to
 * `useMockTranscript`'s scripted filler otherwise) — this component only
 * renders and scrolls whatever string it's given, real or mocked.
 *
 * Always mounted at its fixed height, even with an empty `text` — real
 * speech recognition starts silent (unlike the old mock, which began
 * filling in immediately), so unmounting while empty would collapse this
 * component's reserved space and shift the mic button/divider/chat input
 * below it down the moment the student's first words are recognized.
 */
export interface TranscriptViewProps {
  text: string;
}

export function TranscriptView({ text }: TranscriptViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [text]);

  return (
    // aria-hidden, not aria-live: this updates every ~180ms as words are
    // revealed — a live region at that rate would spam screen readers on
    // every word. The prompt itself (MascotBubble) already carries the
    // essential content; this is a decorative supplement, same treatment
    // as Waveform.
    <div className={styles.transcript} ref={scrollRef} aria-hidden="true">
      <p className={styles.text}>{text}</p>
    </div>
  );
}
