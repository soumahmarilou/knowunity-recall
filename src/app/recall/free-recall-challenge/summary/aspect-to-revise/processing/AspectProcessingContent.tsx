"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { BadgeChip } from "@/components/BadgeChip/BadgeChip";
import { ProgressIndicator } from "@/components/ProgressIndicator/ProgressIndicator";
import { MascotBubble } from "@/components/MascotBubble/MascotBubble";
import { MicButton } from "@/components/MicButton/MicButton";
import { ButtonIcon } from "@/components/ButtonIcon/ButtonIcon";
import { ChatInput } from "@/components/ChatInput/ChatInput";
import { XClose, Redo01 } from "@/components/Icons/Icons";
import { getEntryFromSearchParam, studyPlanCloseUrl } from "@/lib/entryPoint";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import {
  ASPECT_PASS_ODDS_BY_ATTEMPT,
  ASPECT_XP_BY_OUTCOME,
  getAspectFromSearchParam,
  getTotalAspectsFromSearchParam,
  getHintsFromSearchParam,
  getCoverageFromSearchParam,
  getXpFromSearchParam,
  getSubjectFromSearchParam,
  getAspectProgress,
  buildFrcQuery,
} from "../../../frc";
// Reuses Recording's own page.module.css — see Guided Reflection's
// Processing for why (Marilou's fix: Processing shouldn't restructure the
// screen, only Knowie's state should change).
import styles from "../recording/page.module.css";

const THINKING_MS = 1200;
const RESULT_BEAT_MS = 1000;
const AFFIRMATIONS = ["Nice, that's it!", "Exactly right!", "Great explanation!"];
const HINT_MESSAGES = ["Let's take it a bit further.", "So close, here's a nudge.", "Almost, one more angle."];
const REVEAL_MESSAGES = ["That one's tricky, let's look at it together.", "Let's go through this one together."];

/**
 * Free Recall Challenge – Aspect to revise – Processing. Same ladder
 * mechanic as Concept Questions' own Processing (odds shift toward pass
 * after each hint, forced reveal at attempt 3, regardless-of-outcome) —
 * SPEC.md 9f is explicit this sub-flow reuses that mechanic — including,
 * per direct instruction, the same "determined"/"confused" expression
 * treatment as CQ's own Processing (that instruction named Concept
 * Questions specifically, but since this sub-flow's whole point is
 * mirroring CQ's mechanic 1:1, leaving it on the old two-phase-only
 * behavior would make the "same mechanic" claim false for this one detail).
 */
export function AspectProcessingContent() {
  const router = useRouter();
  usePrefetchRoutes([
    "/recall/free-recall-challenge/summary/aspect-to-revise",
    "/recall/free-recall-challenge/final-summary",
  ]);
  const searchParams = useSearchParams();
  const aspectIndex = getAspectFromSearchParam(searchParams.get("aspect"));
  const total = getTotalAspectsFromSearchParam(searchParams.get("total"));
  const hints = getHintsFromSearchParam(searchParams.get("hints"));
  const coverage = getCoverageFromSearchParam(searchParams.get("coverage"));
  const xp = getXpFromSearchParam(searchParams.get("xp"));
  const subject = getSubjectFromSearchParam(searchParams.get("subject"));
  const entry = getEntryFromSearchParam(searchParams.get("entry"));
  const sentViaText = searchParams.get("via") === "text";
  const attempt = hints + 1;

  const [passed] = useState<boolean>(() => {
    if (attempt === 3) return false;
    return Math.random() < ASPECT_PASS_ODDS_BY_ATTEMPT[attempt as 1 | 2];
  });
  const [affirmation] = useState(() => AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
  const [hintMessage] = useState(() => HINT_MESSAGES[Math.floor(Math.random() * HINT_MESSAGES.length)]);
  const [revealMessage] = useState(() => REVEAL_MESSAGES[Math.floor(Math.random() * REVEAL_MESSAGES.length)]);
  const [phase, setPhase] = useState<"thinking" | "affirming" | "hinting" | "revealing">("thinking");
  const [message] = useState("");

  useEffect(() => {
    const thinkingTimer = setTimeout(() => {
      if (attempt === 3) {
        setPhase("revealing");
      } else if (passed) {
        setPhase("affirming");
      } else {
        setPhase("hinting");
      }
    }, THINKING_MS);
    return () => clearTimeout(thinkingTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase === "thinking") return;
    const resultTimer = setTimeout(navigate, RESULT_BEAT_MS);
    return () => clearTimeout(resultTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function advance(nextXp: number) {
    if (aspectIndex >= total) {
      router.push(
        `/recall/free-recall-challenge/final-summary?${buildFrcQuery({ coverage, xp: nextXp, subject, entry })}`,
      );
    } else {
      router.push(
        `/recall/free-recall-challenge/summary/aspect-to-revise?${buildFrcQuery({
          aspect: aspectIndex + 1,
          total,
          hints: 0,
          coverage,
          xp: nextXp,
          subject,
          entry,
        })}`,
      );
    }
  }

  function navigate() {
    if (attempt === 3) {
      // Forced reveal is no longer its own screen — per direct
      // instruction (mirroring the same fix on Concept Questions), it
      // lands back on the same Aspect-to-revise screen with
      // ?revealed=true instead of a dedicated Reveal route.
      router.push(
        `/recall/free-recall-challenge/summary/aspect-to-revise?${buildFrcQuery({
          aspect: aspectIndex,
          total,
          hints,
          coverage,
          xp,
          subject,
          entry,
        })}&revealed=true`,
      );
      return;
    }

    if (passed) {
      const outcomeCode = attempt === 1 ? "first" : "hint";
      advance(xp + ASPECT_XP_BY_OUTCOME[outcomeCode]);
      return;
    }

    const nextHints = hints + 1;
    router.push(
      `/recall/free-recall-challenge/summary/aspect-to-revise?${buildFrcQuery({
        aspect: aspectIndex,
        total,
        hints: nextHints,
        coverage,
        xp,
        subject,
        entry,
      })}`,
    );
  }

  return (
    <Screen>
      <AppBar
        variant="leftIconButtonOnly"
        leftIcon={<XClose />}
        leftAriaLabel="Close"
        onLeftClick={() => router.push(studyPlanCloseUrl(entry, 75))}
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
        {phase === "thinking" && (
          <MascotBubble
            position="Right"
            expression="thinking"
            bodyText="Thinking…"
            showChip={false}
            showButton={false}
          />
        )}
        {phase === "affirming" && (
          <MascotBubble
            position="Right"
            expression="approving"
            bodyText={affirmation}
            showChip={false}
            showButton={false}
          />
        )}
        {phase === "hinting" && (
          <MascotBubble
            position="Right"
            expression="determined"
            bodyText={hintMessage}
            showChip={false}
            showButton={false}
          />
        )}
        {phase === "revealing" && (
          <MascotBubble
            position="Right"
            expression="confused"
            bodyText={revealMessage}
            showChip={false}
            showButton={false}
          />
        )}
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
            {/* Sent via text skips the spin entirely — the chat input's
               own send button animates instead, per direct instruction. */}
            <MicButton
              state={!sentViaText && phase === "thinking" ? "processing" : "sent"}
              aria-label="Sent"
            />
            <p className={styles.controlLabel}>{!sentViaText && phase === "thinking" ? "Send" : "Sent"}</p>
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
          <ChatInput
            state="Answer"
            value={message}
            onChange={() => {}}
            sending={sentViaText && phase === "thinking"}
          />
        </div>
      </div>
    </Screen>
  );
}
