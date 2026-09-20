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
  CONCEPT_QUESTIONS_TERMS,
  XP_BY_OUTCOME,
  getTermFromSearchParam,
  getHintsFromSearchParam,
  getSubjectFromSearchParam,
  getProgressFromOutcomes,
  parseOutcomes,
  appendOutcome,
} from "../../terms";
// Reuses Recording's own page.module.css — see Guided Reflection's
// Processing for why (Marilou's fix: Processing shouldn't restructure the
// screen, only Knowie's state should change).
import styles from "../recording/page.module.css";

const THINKING_MS = 1200;
const RESULT_BEAT_MS = 1000;

// Odds shift toward pass after each hint used, per
// voice_recall_build_decisions.md — attempt 1 uses the base odds, the
// re-attempt after one hint is weighted more toward pass. The re-attempt
// after the second hint (attempt 3) never rolls at all: SPEC.md's own
// "regardless of outcome" language for the forced reveal means the ladder
// terminates deterministically there, not on a third coin flip.
const PASS_ODDS_BY_ATTEMPT: Record<1 | 2, number> = { 1: 0.55, 2: 0.75 };

const AFFIRMATIONS = ["Nice, that's it!", "Exactly right!", "Great explanation!"];
// Shown briefly (expression="determined") before routing to the next hint
// — per direct instruction, distinct from a full pass or the forced-reveal
// case below.
const HINT_MESSAGES = ["Let's take it a bit further.", "So close, here's a nudge.", "Almost, one more angle."];
// Shown briefly (expression="confused") before the forced reveal at
// attempt 3 — per direct instruction, this is the "got it totally wrong"
// case, distinct from a mid-ladder hint.
const REVEAL_MESSAGES = ["That one's tricky, let's look at it together.", "Let's go through this one together."];

/**
 * Concept Questions – Processing. SPEC.md screen 8c — "Same as 7c, but on
 * resolve routes back to session with the result state set." No Figma
 * frame (same situation as Guided Reflection's Processing). The pass/
 * partial roll and the ladder's routing decision both live here.
 */
export function ConceptQuestionsProcessingContent() {
  const router = useRouter();
  usePrefetchRoutes([
    "/recall/concept-questions/session",
    "/recall/concept-questions/summary",
    "/recall/concept-questions/session/reveal",
  ]);
  const searchParams = useSearchParams();
  const term = getTermFromSearchParam(searchParams.get("term"));
  const hints = getHintsFromSearchParam(searchParams.get("hints"));
  const isRepeat = searchParams.get("repeat") === "1";
  const outcomesParam = searchParams.get("outcomes");
  const subject = getSubjectFromSearchParam(searchParams.get("subject"));
  const entry = getEntryFromSearchParam(searchParams.get("entry"));
  const sentViaText = searchParams.get("via") === "text";
  const attempt = hints + 1;
  const outcomes = parseOutcomes(outcomesParam);
  const xpTotal = outcomes.reduce((sum, o) => sum + XP_BY_OUTCOME[o], 0);
  const questionLabel = `Question ${term} of ${CONCEPT_QUESTIONS_TERMS.length}`;

  // A repeat-after-reveal is a guaranteed pass, never rolled — see
  // RevealContent's own doc comment for why. Rolled once per mount
  // otherwise, not re-rolled on re-render.
  const [passed] = useState<boolean>(() => {
    if (isRepeat) return true;
    if (attempt === 3) return false; // irrelevant — forced reveal either way
    return Math.random() < PASS_ODDS_BY_ATTEMPT[attempt as 1 | 2];
  });
  const [affirmation] = useState(() => AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
  const [hintMessage] = useState(() => HINT_MESSAGES[Math.floor(Math.random() * HINT_MESSAGES.length)]);
  const [revealMessage] = useState(() => REVEAL_MESSAGES[Math.floor(Math.random() * REVEAL_MESSAGES.length)]);
  const [phase, setPhase] = useState<"thinking" | "affirming" | "hinting" | "revealing">("thinking");
  const [message] = useState("");
  // The bar shouldn't wait for the *next* screen to show this term's
  // fill once it's actually passed — per direct instruction, term 3
  // passing has nowhere else to show it (Summary has no progress bar),
  // so it would otherwise never be seen at all. Optimistically include
  // the just-determined outcome once the "affirming" phase confirms a
  // pass, purely for this screen's own display; the real, persisted
  // outcomes list still only grows via `navigate()`'s own `appendOutcome`
  // call below. A forced reveal ("revealing" phase) deliberately doesn't
  // get the same treatment — see `getProgressFromOutcomes`'s own comment,
  // a reveal never fills its third, so the bar correctly stays put. A
  // repeat-after-reveal also skips this: it's still the same already-
  // revealed term underneath, nothing new to optimistically add.
  const displayOutcomes =
    phase === "affirming" && !isRepeat
      ? [...outcomes, attempt === 1 ? ("first" as const) : ("hint" as const)]
      : outcomes;

  useEffect(() => {
    const thinkingTimer = setTimeout(() => {
      if (isRepeat) {
        setPhase("affirming");
      } else if (attempt === 3) {
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

  function navigate() {
    if (isRepeat) {
      // Guaranteed pass, no roll — this term's outcome was already
      // appended ("revealed") before Reveal was ever reached, so nothing
      // new gets appended here; appending again would duplicate it and
      // desync every later term's position in the outcomes list.
      if (term === CONCEPT_QUESTIONS_TERMS.length) {
        router.push(
          `/recall/concept-questions/summary?outcomes=${outcomesParam ?? ""}&subject=${encodeURIComponent(subject)}&entry=${entry}`,
        );
      } else {
        router.push(
          `/recall/concept-questions/session?term=${term + 1}&hints=0&outcomes=${outcomesParam ?? ""}&subject=${encodeURIComponent(subject)}&entry=${entry}`,
        );
      }
      return;
    }

    if (attempt === 3) {
      // Reveal is its own route (SPEC.md 8d) — the ladder's 2nd hint
      // failing routes here automatically, "revealed" already appended.
      const nextOutcomes = appendOutcome(outcomesParam, "revealed");
      router.push(
        `/recall/concept-questions/session/reveal?term=${term}&outcomes=${nextOutcomes}&subject=${encodeURIComponent(subject)}&entry=${entry}`,
      );
      return;
    }

    if (passed) {
      // A hinted pass used to route through Say it back first; that step
      // is gone entirely per direct instruction, so it now advances the
      // same way a clean first-try pass always did.
      const outcomeCode = attempt === 1 ? "first" : "hint";
      const nextOutcomes = appendOutcome(outcomesParam, outcomeCode);

      if (term === CONCEPT_QUESTIONS_TERMS.length) {
        router.push(
          `/recall/concept-questions/summary?outcomes=${nextOutcomes}&subject=${encodeURIComponent(subject)}&entry=${entry}`,
        );
      } else {
        router.push(
          `/recall/concept-questions/session?term=${term + 1}&hints=0&outcomes=${nextOutcomes}&subject=${encodeURIComponent(subject)}&entry=${entry}`,
        );
      }
      return;
    }

    // Partial: same term, one more hint, outcomes unchanged.
    const nextHints = hints + 1;
    const query = `term=${term}&hints=${nextHints}${outcomesParam ? `&outcomes=${outcomesParam}` : ""}&subject=${encodeURIComponent(subject)}&entry=${entry}`;
    router.push(`/recall/concept-questions/session?${query}`);
  }

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
          <div className={styles.progressBar}>
            <ProgressIndicator
              variant="Primary"
              thickness="24"
              progress={getProgressFromOutcomes(displayOutcomes)}
              aria-label={`Term ${term} of ${CONCEPT_QUESTIONS_TERMS.length}`}
            />
          </div>
          <BadgeChip type="xp" label={String(xpTotal)} />
        </div>
      </AppBar>

      <div className={styles.middleContent}>
        {phase === "thinking" && (
          <MascotBubble
            position="Left"
            expression="thinking"
            overline={questionLabel}
            bodyText="Thinking…"
            showChip={false}
            showButton={false}
          />
        )}
        {phase === "affirming" && (
          <MascotBubble
            position="Left"
            expression="approving"
            overline={questionLabel}
            bodyText={affirmation}
            showChip={false}
            showButton={false}
          />
        )}
        {phase === "hinting" && (
          <MascotBubble
            position="Left"
            expression="determined"
            overline={questionLabel}
            bodyText={hintMessage}
            showChip={false}
            showButton={false}
          />
        )}
        {phase === "revealing" && (
          <MascotBubble
            position="Left"
            expression="confused"
            overline={questionLabel}
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
               own send button animates instead (see the ChatInput
               below), per direct instruction. */}
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
