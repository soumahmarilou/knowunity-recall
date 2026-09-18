"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Live-growing mocked transcript — the fallback path for
 * `useSpeechTranscript` (`src/lib/speechTranscript.ts`), which uses the
 * browser's real Web Speech API where available. This file is what shows
 * instead on browsers without that support (Firefox, Safari as of this
 * writing): scripted, topic-neutral filler text revealed word by word
 * while recording is active, not a transcription of anything actually
 * said. Deliberately generic (no lesson-specific wording) since the
 * subject is now dynamic (see Guided Reflection's own subject-threading)
 * and this text has to read plausibly for any of them.
 */

const TRANSCRIPT_SCRIPT =
  "So basically what I remember is that you need to break it down into smaller parts first, and then look at how those parts connect to each other. I think the important part is understanding why it actually works, not just memorizing the steps. Once that clicks, the rest kind of follows naturally.";

const WORD_INTERVAL_MS = 180;

export function useMockTranscript(active: boolean): string {
  const [text, setText] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setText("");
      indexRef.current = 0;
      return;
    }

    const words = TRANSCRIPT_SCRIPT.split(" ");
    const id = setInterval(() => {
      indexRef.current += 1;
      setText(words.slice(0, indexRef.current).join(" "));
      if (indexRef.current >= words.length) clearInterval(id);
    }, WORD_INTERVAL_MS);

    return () => clearInterval(id);
  }, [active]);

  return text;
}
