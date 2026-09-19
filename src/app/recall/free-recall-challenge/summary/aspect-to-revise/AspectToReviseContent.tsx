"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { BadgeChip } from "@/components/BadgeChip/BadgeChip";
import { ProgressIndicator } from "@/components/ProgressIndicator/ProgressIndicator";
import { MascotBubble } from "@/components/MascotBubble/MascotBubble";
import { MicButton } from "@/components/MicButton/MicButton";
import { MicPermissionPrimer } from "@/components/MicPermissionPrimer/MicPermissionPrimer";
import { ChatInput } from "@/components/ChatInput/ChatInput";
import { XClose } from "@/components/Icons/Icons";
import { useMicPermission } from "@/lib/micPermission";
import { getEntryFromSearchParam } from "@/lib/entryPoint";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import {
  FRC_ASPECTS,
  getAspectFromSearchParam,
  getTotalAspectsFromSearchParam,
  getHintsFromSearchParam,
  getCoverageFromSearchParam,
  getXpFromSearchParam,
  getSubjectFromSearchParam,
  getAspectPrompt,
  getAspectProgress,
  buildFrcQuery,
} from "../../frc";
import styles from "./page.module.css";

/**
 * Free Recall Challenge – Aspect to revise. SPEC.md screen 9f. No Figma
 * frame for the sub-flow's Recording/Processing/Reveal routing was ever
 * confirmed (SPEC.md itself lists this as Open) — built as FRC's own copies
 * of Concept Questions' ladder mechanic rather than reusing CQ's literal
 * routes, since those are hardwired to CQ's own terms.ts content and
 * outcome model. Disclosed in this build's report, not silently decided.
 *
 * Reveal is no longer its own screen, mirroring CQ's own Launched screen
 * fix — tapping "Reveal answer" stays right here (bubble content swaps to
 * the answer, button becomes "Next"), and the automatic forced-reveal
 * after the second hint lands here too, via `?revealed=true`.
 *
 * The AppBar now also shows the running XP badge, per direct instruction
 * — this sub-flow mirrors Concept Questions' mechanic exactly, including
 * that badge, which this screen (and its Recording/Processing siblings)
 * had simply never carried over.
 */
export function AspectToReviseContent() {
  const router = useRouter();
  usePrefetchRoutes([
    "/recall/free-recall-challenge/summary/aspect-to-revise/recording",
    "/recall/free-recall-challenge/summary/aspect-to-revise/processing",
  ]);
  const searchParams = useSearchParams();
  const aspectIndex = getAspectFromSearchParam(searchParams.get("aspect"));
  const total = getTotalAspectsFromSearchParam(searchParams.get("total"));
  const hints = getHintsFromSearchParam(searchParams.get("hints"));
  const coverage = getCoverageFromSearchParam(searchParams.get("coverage"));
  const xp = getXpFromSearchParam(searchParams.get("xp"));
  const subject = getSubjectFromSearchParam(searchParams.get("subject"));
  const entry = getEntryFromSearchParam(searchParams.get("entry"));
  const aspect = FRC_ASPECTS[aspectIndex - 1];

  const { status, requestMicPermission } = useMicPermission();
  const [showPrimer, setShowPrimer] = useState(false);
  const [showReenableHelp, setShowReenableHelp] = useState(false);
  const [message, setMessage] = useState("");

  // Same in-place reveal as Concept Questions' own Launched screen (see
  // that build's comment) — mirrors CQ's mechanic 1:1, so this mirrors
  // that fix too. No separate outcomes string to capture here (FRC's
  // aspect ladder only ever carries a plain accumulating `xp` number, not
  // per-aspect outcome tracking), so there's nothing extra to thread
  // through to "Next" beyond what's already in the URL.
  const revealedParam = searchParams.get("revealed") === "true";
  const [selfRevealed, setSelfRevealed] = useState(false);
  const revealed = revealedParam || selfRevealed;

  const bodyText = hints === 0 ? getAspectPrompt(aspectIndex, subject) : aspect.hints[hints - 1].body;
  // "Aspect you didn't recall" now lives in the bubble's own chip slot,
  // not as a separate right-aligned label outside it — per direct
  // instruction. It only occupies that slot before any hint; once a hint
  // is given, the chip switches to the hint's own status text, same as
  // every other mode's hint ladder.
  const chipText = hints === 0 ? "Aspect you didn't recall" : aspect.hints[hints - 1].chipText;
  // Red for the "you missed this" framing, blue once a hint is actually
  // given — per direct instruction, distinct from the hint-status chip
  // this same slot shows afterward.
  const chipColor = hints === 0 ? "error" : "info";
  const query = buildFrcQuery({ aspect: aspectIndex, total, hints, coverage, xp, subject, entry });

  const goToRecording = () =>
    router.push(`/recall/free-recall-challenge/summary/aspect-to-revise/recording?${query}`);

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

  const handleRevealAnswer = () => setSelfRevealed(true);

  const goToNext = () => {
    if (aspectIndex >= total) {
      router.push(
        `/recall/free-recall-challenge/final-summary?${buildFrcQuery({ coverage, xp, subject, entry })}`,
      );
    } else {
      router.push(
        `/recall/free-recall-challenge/summary/aspect-to-revise?${buildFrcQuery({
          aspect: aspectIndex + 1,
          total,
          hints: 0,
          coverage,
          xp,
          subject,
          entry,
        })}`,
      );
    }
  };

  return (
    <Screen>
      <AppBar
        variant="leftIconButtonOnly"
        leftIcon={<XClose />}
        leftAriaLabel="Close"
        onLeftClick={() => router.push("/")}
      >
        <div className={styles.progressRow}>
          <div className={styles.progressBar}>
            <ProgressIndicator
              variant="Primary"
              thickness="24"
              progress={getAspectProgress(aspectIndex, total)}
              aria-label={`Aspect ${aspectIndex} of ${total}`}
            />
          </div>
          <span className={styles.aspectCount} aria-hidden="true">
            {aspectIndex}/{total}
          </span>
          <BadgeChip type="xp" label={String(xp)} />
        </div>
      </AppBar>

      <div className={styles.middleContent}>
        <MascotBubble
          position="Right"
          expression={revealed ? "confused" : "standby"}
          bodyText={revealed ? aspect.revealAnswer : bodyText}
          showChip={!revealed}
          chipText={chipText}
          chipColor={chipColor}
          showButton
          buttonText={revealed ? "Next" : "Reveal answer"}
          onRevealAnswer={revealed ? goToNext : handleRevealAnswer}
        />
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
            onSend={() =>
              router.push(`/recall/free-recall-challenge/summary/aspect-to-revise/processing?${query}&via=text`)
            }
          />
        </div>
      </div>
    </Screen>
  );
}
