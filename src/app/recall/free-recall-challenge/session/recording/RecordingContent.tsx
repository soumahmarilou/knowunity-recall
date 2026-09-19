"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { ProgressIndicator } from "@/components/ProgressIndicator/ProgressIndicator";
import { BadgeChip } from "@/components/BadgeChip/BadgeChip";
import { MascotBubble } from "@/components/MascotBubble/MascotBubble";
import { Waveform } from "@/components/Waveform/Waveform";
import { MicButton } from "@/components/MicButton/MicButton";
import { ButtonIcon } from "@/components/ButtonIcon/ButtonIcon";
import { ChatInput } from "@/components/ChatInput/ChatInput";
import { TranscriptView } from "@/components/TranscriptView/TranscriptView";
import { XClose, DotsVertical, Redo01 } from "@/components/Icons/Icons";
import { useMicLevel } from "@/lib/micLevel";
import { useSpeechTranscript } from "@/lib/speechTranscript";
import { getEntryFromSearchParam, studyPlanCloseUrl } from "@/lib/entryPoint";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import {
  TOTAL_SECONDS,
  computeRemainingSeconds,
  formatCountdown,
  getStartFromSearchParam,
  getCoverageFromSearchParam,
  getXpFromSearchParam,
  getSubjectFromSearchParam,
  getFrcPrompt,
  buildFrcQuery,
} from "../../frc";
import styles from "./page.module.css";

/**
 * Free Recall Challenge – Recording. SPEC.md screen 9b — "same Send/Redo
 * pattern as 7b, per segment... Timer keeps running in the background
 * throughout." Also builds 9b's one sanctioned auto-endpointing exception:
 * if the timer hits 0 while this segment is still being recorded (not yet
 * sent), auto-cut and auto-send what's captured, straight to Processing.
 */
export function FreeRecallChallengeRecordingContent() {
  const router = useRouter();
  usePrefetchRoutes(["/recall/free-recall-challenge/session/processing"]);
  const searchParams = useSearchParams();
  const start = getStartFromSearchParam(searchParams.get("start"));
  const coverage = getCoverageFromSearchParam(searchParams.get("coverage"));
  const xp = getXpFromSearchParam(searchParams.get("xp"));
  const subject = getSubjectFromSearchParam(searchParams.get("subject"));
  const entry = getEntryFromSearchParam(searchParams.get("entry"));
  const [message, setMessage] = useState("");
  const micLevels = useMicLevel(true);
  // No mocked transcript while the student is typing instead of speaking
  // — per direct instruction, it's meant to read as "what's being heard,"
  // which doesn't apply once they've switched to text.
  const isTyping = message.trim().length > 0;
  const transcript = useSpeechTranscript(!isTyping);
  // See Launched's SessionContent.tsx for why this starts at TOTAL_SECONDS
  // rather than computing the real remaining time during the initializer —
  // same confirmed hydration-mismatch fix, applied here too.
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const hasSentRef = useRef(false);

  const query = buildFrcQuery({ start, coverage, xp, subject, entry });
  // `via` distinguishes the mic's own send from the chat input's, so
  // Processing knows which control should show the loading animation —
  // per direct instruction, a text send animates the chat input's send
  // button, not the recording button. Defaults to "voice" for the timer
  // auto-cut case below (cutting off an in-progress voice recording).
  const goToProcessing = (via: "voice" | "text" = "voice") => {
    if (hasSentRef.current) return;
    hasSentRef.current = true;
    router.push(`/recall/free-recall-challenge/session/processing?${query}&via=${via}`);
  };

  useEffect(() => {
    setRemaining(computeRemainingSeconds(start));
    const id = setInterval(() => setRemaining(computeRemainingSeconds(start)), 1000);
    return () => clearInterval(id);
  }, [start]);

  useEffect(() => {
    if (remaining <= 0) goToProcessing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  return (
    <Screen>
      <AppBar
        variant="leftAndRightIconButton"
        leftIcon={<XClose />}
        leftAriaLabel="Close"
        onLeftClick={() => router.push(studyPlanCloseUrl(entry, 50))}
        rightIcon={<DotsVertical />}
        rightAriaLabel="More options"
      >
        <div className={styles.progressRow}>
          <span className={styles.countdown}>{formatCountdown(remaining)}</span>
          <BadgeChip type="xp" label={String(xp)} />
        </div>
      </AppBar>

      <div className={styles.middleContent}>
        <MascotBubble
          position="Left"
          expression="standby"
          bodyText={getFrcPrompt(subject)}
          showChip={false}
          showButton={false}
        />
        <div>
          <div className={styles.coverageRow}>
            <p className={styles.coverageLabel}>Coverage</p>
            <p className={styles.coveragePercent}>{coverage}%</p>
          </div>
          <div className={styles.coverageBar}>
            <ProgressIndicator
              variant="Primary"
              thickness="24"
              progress={coverage}
              aria-label={`Coverage ${coverage}%`}
            />
          </div>
        </div>
      </div>

      <div className={styles.bottomContent}>
        {/* Above the waveform, not wedged between it and the controls —
           when there's no text yet (recognition hasn't caught real
           speech), TranscriptView's reserved empty space sits up here
           instead of pushing the waveform away from its controls. */}
        <TranscriptView text={transcript} />

        <div className={styles.waveformRow}>
          <Waveform levels={micLevels} />
        </div>

        <div className={styles.controlsRow}>
          <div className={styles.controlColumn}>
            <ButtonIcon
              variant="Secondary"
              size="L"
              icon={<Redo01 />}
              aria-label="Redo"
              onClick={() => router.push(`/recall/free-recall-challenge/session?${query}`)}
            />
            <p className={styles.controlLabel}>Redo</p>
          </div>
          <div className={styles.controlColumn}>
            <MicButton state="recording" aria-label="Send recording" onClick={() => goToProcessing("voice")} />
            <p className={styles.controlLabel}>Send</p>
          </div>
          {/* Invisible mirror of the Redo column — keeps Send anchored at
             the row's true center regardless of Redo's own width. */}
          <div className={styles.controlColumn} aria-hidden="true" style={{ visibility: "hidden" }}>
            <ButtonIcon variant="Secondary" size="L" icon={<Redo01 />} aria-label="" />
            <p className={styles.controlLabel}>Redo</p>
          </div>
        </div>

        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <p className={styles.dividerText}>or</p>
          <span className={styles.dividerLine} />
        </div>

        <div className={styles.chatInputRow}>
          <ChatInput state="Answer" value={message} onChange={setMessage} onSend={() => goToProcessing("text")} />
        </div>
      </div>
    </Screen>
  );
}
