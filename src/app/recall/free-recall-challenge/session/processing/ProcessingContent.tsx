"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { ProgressIndicator } from "@/components/ProgressIndicator/ProgressIndicator";
import { BadgeChip } from "@/components/BadgeChip/BadgeChip";
import { MascotBubble } from "@/components/MascotBubble/MascotBubble";
import { MicButton } from "@/components/MicButton/MicButton";
import { ButtonIcon } from "@/components/ButtonIcon/ButtonIcon";
import { ChatInput } from "@/components/ChatInput/ChatInput";
import { XClose, DotsVertical, Redo01 } from "@/components/Icons/Icons";
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
  buildFrcQuery,
} from "../../frc";
// Reuses Recording's own page.module.css — see Guided Reflection's
// Processing for why (Marilou's fix: Processing shouldn't restructure the
// screen, only Knowie's state should change).
import styles from "../recording/page.module.css";

const THINKING_MS = 1200;
// The mic button's own spin is shorter than the full thinking beat — per
// direct instruction it's only there to show the send happening (under
// 2s), then settles into a greyed, disabled "Sent" state for whatever's
// left of the beat, same shape as every other mode's Processing screen
// even though this one has no separate second phase of its own.
const SPIN_MS = 800;

/**
 * Free Recall Challenge – Processing. SPEC.md screen 9c — "same as 7c/8c,
 * every sent segment gets this beat, no special-casing for FRC's rapid-fire
 * pace." The coverage bump and XP increment happen on the next screen
 * (After recording), not here — 9c's own component list is just the
 * thinking beat, matching where SPEC.md assigns the "bumped... random" text
 * (9d), not this screen.
 *
 * `via=text` (per direct instruction): a segment sent from the chat input
 * animates the chat input's own send button instead of the recording
 * button — the mic button skips straight to "sent" (no spin, since it was
 * never the control that actually sent anything).
 */
export function FreeRecallChallengeProcessingContent() {
  const router = useRouter();
  usePrefetchRoutes(["/recall/free-recall-challenge/session/after-recording"]);
  const searchParams = useSearchParams();
  const start = getStartFromSearchParam(searchParams.get("start"));
  const coverage = getCoverageFromSearchParam(searchParams.get("coverage"));
  const xp = getXpFromSearchParam(searchParams.get("xp"));
  const subject = getSubjectFromSearchParam(searchParams.get("subject"));
  const entry = getEntryFromSearchParam(searchParams.get("entry"));
  const sentViaText = searchParams.get("via") === "text";
  // Same hydration-safe placeholder as Launched/Recording's countdown —
  // see SessionContent.tsx for why it can't compute the real value during
  // the initializer.
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [micState, setMicState] = useState<"processing" | "sent">(sentViaText ? "sent" : "processing");
  const [chatSending, setChatSending] = useState(sentViaText);

  useEffect(() => {
    setRemaining(computeRemainingSeconds(start));
  }, [start]);

  useEffect(() => {
    const spinTimer = setTimeout(() => {
      setMicState("sent");
      setChatSending(false);
    }, SPIN_MS);
    const navTimer = setTimeout(() => {
      // Its own "After recording" route (SPEC.md 9d) — the coverage bump
      // and encouragement beat happen there, not folded back into the
      // Launched screen.
      router.push(
        `/recall/free-recall-challenge/session/after-recording?${buildFrcQuery({ start, coverage, xp, subject, entry })}`,
      );
    }, THINKING_MS);
    return () => {
      clearTimeout(spinTimer);
      clearTimeout(navTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Screen>
      <AppBar
        variant="leftAndRightIconButton"
        leftIcon={<XClose />}
        leftAriaLabel="Close"
        onLeftClick={() => router.push(studyPlanCloseUrl(entry, 75))}
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
          expression="thinking"
          bodyText="Thinking…"
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
        {/* No waveform — that's a recording-in-progress visual, and this
           recording is already sent by the time this screen shows. */}
        <div className={styles.controlsRow}>
          <div className={styles.controlColumn}>
            <ButtonIcon variant="Secondary" size="L" icon={<Redo01 />} aria-label="Redo" state="Disabled" />
            <p className={styles.controlLabel}>Redo</p>
          </div>
          <div className={styles.controlColumn}>
            <MicButton state={micState} aria-label="Sent" />
            <p className={styles.controlLabel}>{micState === "processing" ? "Send" : "Sent"}</p>
          </div>
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
          <ChatInput state="Answer" value="" onChange={() => {}} sending={chatSending} />
        </div>
      </div>
    </Screen>
  );
}
