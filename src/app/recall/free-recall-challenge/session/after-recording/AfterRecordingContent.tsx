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
  XP_PER_SEGMENT,
  bumpCoverage,
  computeRemainingSeconds,
  formatCountdown,
  getStartFromSearchParam,
  getCoverageFromSearchParam,
  getXpFromSearchParam,
  getSubjectFromSearchParam,
  getFrcResultMessage,
  buildFrcQuery,
} from "../../frc";
// Reuses Recording's own page.module.css, same reasoning as Processing
// (see that screen's own comment): this is the very next beat after
// Processing and must not restructure the screen — same AppBar, same
// coverage-gauge position, same controls row — between adjacent beats.
import styles from "../recording/page.module.css";

// Same fixed lines already approved and verified in this mode's Launched
// screen before this beat was pulled back out into its own route — kept
// verbatim rather than reverted to SPEC.md's older placeholder copy
// ("Keep going, you're on the right track!"); SPEC.md's own text was
// updated to match instead.
const FRC_COMPLETE_MESSAGE = "You did it!";
const RESULT_BEAT_MS = 1500;

/**
 * Free Recall Challenge – After recording. SPEC.md screen 9d, back to
 * being its own route per direct instruction — an earlier version folded
 * this beat into the Launched screen's own in-place state instead
 * (`?justSent=true`), which is now removed from that screen entirely.
 *
 * Rolls the coverage bump once on mount, client-only (same hydration-safe
 * reasoning as every other roll in this mode — server and the client's
 * first paint both show the pre-bump values and a neutral "Thinking…",
 * then the effect flips to the real result in the same tick). Shows the
 * result for RESULT_BEAT_MS, then auto-advances: to Summary if the bump
 * landed on 100% or the clock's run out, otherwise back to Launched
 * (Idle) for the next segment.
 */
export function AfterRecordingContent() {
  const router = useRouter();
  usePrefetchRoutes(["/recall/free-recall-challenge/session", "/recall/free-recall-challenge/summary"]);
  const searchParams = useSearchParams();
  const start = getStartFromSearchParam(searchParams.get("start"));
  const urlCoverage = getCoverageFromSearchParam(searchParams.get("coverage"));
  const urlXp = getXpFromSearchParam(searchParams.get("xp"));
  const subject = getSubjectFromSearchParam(searchParams.get("subject"));
  const entry = getEntryFromSearchParam(searchParams.get("entry"));

  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [coverage, setCoverage] = useState(urlCoverage);
  const [xp, setXp] = useState(urlXp);
  const [rolled, setRolled] = useState(false);

  useEffect(() => {
    setRemaining(computeRemainingSeconds(start));
  }, [start]);

  useEffect(() => {
    const bumped = bumpCoverage(urlCoverage);
    const nextXp = urlXp + XP_PER_SEGMENT;
    setCoverage(bumped);
    setXp(nextXp);
    setRolled(true);

    const timer = setTimeout(() => {
      const stillRemaining = computeRemainingSeconds(start);
      // 100% coverage ends the challenge right away, whether or not time
      // is still on the clock — no reason to keep the student talking
      // once every aspect's been covered.
      if (bumped === "100" || stillRemaining <= 0) {
        router.push(
          `/recall/free-recall-challenge/summary?${buildFrcQuery({ coverage: bumped, xp: nextXp, subject, entry })}`,
        );
      } else {
        router.push(
          `/recall/free-recall-challenge/session?${buildFrcQuery({ start, coverage: bumped, xp: nextXp, subject, entry })}`,
        );
      }
    }, RESULT_BEAT_MS);
    return () => clearTimeout(timer);
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
          expression={rolled ? (coverage === "100" ? "excited" : "approving") : "thinking"}
          bodyText={rolled ? (coverage === "100" ? FRC_COMPLETE_MESSAGE : getFrcResultMessage(subject)) : "Thinking…"}
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
            <MicButton state="sent" aria-label="Sent" />
            <p className={styles.controlLabel}>Sent</p>
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
          <ChatInput state="Answer" value="" onChange={() => {}} />
        </div>
      </div>
    </Screen>
  );
}
