"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { ProgressIndicator } from "@/components/ProgressIndicator/ProgressIndicator";
import { BadgeChip } from "@/components/BadgeChip/BadgeChip";
import { MascotBubble } from "@/components/MascotBubble/MascotBubble";
import { MicButton } from "@/components/MicButton/MicButton";
import { MicPermissionPrimer } from "@/components/MicPermissionPrimer/MicPermissionPrimer";
import { ChatInput } from "@/components/ChatInput/ChatInput";
import { XClose, DotsVertical } from "@/components/Icons/Icons";
import { useMicPermission } from "@/lib/micPermission";
import { getEntryFromSearchParam } from "@/lib/entryPoint";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import {
  TOTAL_SECONDS,
  computeRemainingSeconds,
  formatCountdown,
  getStartFromSearchParam,
  getCoverageFromSearchParam,
  getXpFromSearchParam,
  buildFrcQuery,
} from "../frc";
import styles from "./page.module.css";

const FRC_PROMPT = "You have 1 minute. Tell me everything you remember about Algebraic Fractions. Go!";

/**
 * Free Recall Challenge – Launched. SPEC.md screen 9a
 * (src/app/recall/free-recall-challenge/session/page.tsx). No Figma frame
 * confirmed this session (Desktop Bridge stayed disconnected) — composition
 * and the countdown/coverage/XP state machine follow SPEC.md's own
 * component list plus voice_recall_build_decisions.md's segmented-recording
 * description, disclosed as this build's interpretation.
 *
 * The coverage bump and encouragement message happen on their own "After
 * recording" route (9d), not folded into this screen — an earlier version
 * did fold them in here, but per direct instruction that route needed to
 * come back as a real, separate screen, so this one goes back to being a
 * plain Idle screen: it always shows FRC_PROMPT, never a result message,
 * and reads `coverage`/`xp` straight off the URL rather than rolling
 * anything itself.
 *
 * The coverage gauge itself sits below the mascot's bubble now, not in the
 * AppBar — "Coverage" / live percentage directly above the bar — per
 * direct instruction correcting its position against the real mockup.
 */
export function FreeRecallChallengeSessionContent() {
  const router = useRouter();
  usePrefetchRoutes([
    "/recall/free-recall-challenge/session/recording",
    "/recall/free-recall-challenge/session/processing",
  ]);
  const searchParams = useSearchParams();
  const start = getStartFromSearchParam(searchParams.get("start"));
  const coverage = getCoverageFromSearchParam(searchParams.get("coverage"));
  const xp = getXpFromSearchParam(searchParams.get("xp"));
  const entry = getEntryFromSearchParam(searchParams.get("entry"));

  const { status, requestMicPermission } = useMicPermission();
  const [showPrimer, setShowPrimer] = useState(false);
  const [showReenableHelp, setShowReenableHelp] = useState(false);
  const [message, setMessage] = useState("");
  // Starts at TOTAL_SECONDS (identical on server and client) rather than
  // computeRemainingSeconds(start) — that reaches Date.now(), which differs
  // between the server-rendered pass and the client's hydration pass and
  // threw a confirmed hydration-mismatch error during this build's own
  // verification. The real value syncs client-only in the effect below.
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);

  useEffect(() => {
    setRemaining(computeRemainingSeconds(start));
    const id = setInterval(() => setRemaining(computeRemainingSeconds(start)), 1000);
    return () => clearInterval(id);
  }, [start]);

  // The timer keeps running "in the background throughout" per
  // voice_recall_build_decisions.md — if it reaches 0 while the student is
  // just sitting on Idle (not mid-recording, which has its own auto-cut
  // case, and not on After recording, which has its own end-of-clock
  // branch), ending the challenge here rather than leaving them stranded
  // on an expired-timer screen is this build's disclosed reading of
  // "never trap the student."
  useEffect(() => {
    if (remaining <= 0) {
      router.push(`/recall/free-recall-challenge/summary?${buildFrcQuery({ coverage, xp, entry })}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  const query = buildFrcQuery({ start, coverage, xp, entry });
  const goToRecording = () => router.push(`/recall/free-recall-challenge/session/recording?${query}`);

  const handleMicTap = () => {
    if (status === "granted") {
      goToRecording();
    } else if (status === "unknown") {
      setShowPrimer(true);
    }
  };

  const handlePrimerAllow = async () => {
    const result = await requestMicPermission();
    setShowPrimer(false);
    if (result === "granted") goToRecording();
  };

  return (
    <Screen>
      <AppBar
        variant="leftAndRightIconButton"
        leftIcon={<XClose />}
        leftAriaLabel="Close"
        onLeftClick={() => router.push("/")}
        rightIcon={<DotsVertical />}
        rightAriaLabel="More options"
      >
        <div className={styles.progressRow}>
          <span className={styles.countdown}>{formatCountdown(remaining)}</span>
          <BadgeChip type="xp" label={String(xp)} />
        </div>
      </AppBar>

      <div className={styles.middleContent}>
        <MascotBubble position="Left" expression="standby" bodyText={FRC_PROMPT} showChip={false} showButton={false} />
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
        <div className={styles.micRow}>
          {showPrimer && (
            <MicPermissionPrimer onAllow={handlePrimerAllow} onDismiss={() => setShowPrimer(false)} />
          )}

          {status === "denied" ? (
            <>
              <MicButton state="disabled" aria-label="Microphone unavailable" />
              <p className={styles.micDisabledNote}>
                Mic access denied.{" "}
                <button type="button" onClick={() => setShowReenableHelp((v) => !v)}>
                  How to re-enable
                </button>
              </p>
              {showReenableHelp && (
                <p className={styles.micDisabledNote}>
                  Open your browser or phone Settings, find this site&apos;s permissions, and allow
                  Microphone access.
                </p>
              )}
            </>
          ) : (
            <>
              <MicButton state="idle" aria-label="Record your answer" onClick={handleMicTap} />
              <p className={styles.micLabel}>Tap to answer</p>
            </>
          )}
        </div>

        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <p className={styles.dividerText}>or</p>
          <span className={styles.dividerLine} />
        </div>

        <div className={styles.chatInputRow}>
          <ChatInput
            state="Answer"
            value={message}
            onChange={setMessage}
            onSend={() => router.push(`/recall/free-recall-challenge/session/processing?${query}&via=text`)}
          />
        </div>
      </div>
    </Screen>
  );
}
