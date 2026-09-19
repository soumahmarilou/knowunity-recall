"use client";

import { useState } from "react";
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
import { getEntryFromSearchParam, studyPlanCloseUrl } from "@/lib/entryPoint";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import {
  CONCEPT_QUESTIONS_TERMS,
  XP_BY_OUTCOME,
  PROGRESS_BY_TERM,
  getTermFromSearchParam,
  getHintsFromSearchParam,
  getSubjectFromSearchParam,
  getTermPrompt,
  parseOutcomes,
  appendOutcome,
} from "../terms";
import styles from "./page.module.css";

/**
 * Concept Questions – Launched. SPEC.md screen 8a
 * (src/app/recall/concept-questions/session/page.tsx). Figma frame:
 * "Concept Questions - Launched" (node 13659:5771, Design Deliverables
 * page) for attempt 1 / Idle, and its partial-result variant (node
 * 13749:1171) for the hint state — Permission-priming and Mic-disabled
 * have no Figma frame, built per voice_recall_build_decisions.md like
 * Guided Reflection's Launched screen.
 *
 * Reveal is its own route again (SPEC.md 8d) — the self-service "Reveal
 * answer" tap below appends the "revealed" outcome and navigates there
 * directly, rather than swapping this screen's own content in place.
 * Processing's automatic forced-reveal (after the ladder's 2nd hint)
 * navigates to the same route on its own. "Say it back" is gone entirely
 * per direct instruction — a hinted pass advances straight to the next
 * term/summary the same way a first-try pass always did.
 */
export function ConceptQuestionsSessionContent() {
  const router = useRouter();
  usePrefetchRoutes([
    "/recall/concept-questions/session/recording",
    "/recall/concept-questions/session/processing",
    "/recall/concept-questions/session/reveal",
  ]);
  const searchParams = useSearchParams();
  const term = getTermFromSearchParam(searchParams.get("term"));
  const hints = getHintsFromSearchParam(searchParams.get("hints"));
  const outcomesParam = searchParams.get("outcomes");
  const subject = getSubjectFromSearchParam(searchParams.get("subject"));
  const entry = getEntryFromSearchParam(searchParams.get("entry"));
  const currentTerm = CONCEPT_QUESTIONS_TERMS[term - 1];

  const xpTotal = parseOutcomes(outcomesParam).reduce((sum, o) => sum + XP_BY_OUTCOME[o], 0);
  const bodyText = hints === 0 ? getTermPrompt(term, subject) : currentTerm.hints[hints - 1].body;
  const chipText = hints === 0 ? undefined : currentTerm.hints[hints - 1].chipText;

  const { status, requestMicPermission } = useMicPermission();
  const [showPrimer, setShowPrimer] = useState(false);
  const [showReenableHelp, setShowReenableHelp] = useState(false);
  const [message, setMessage] = useState("");

  const query = `term=${term}&hints=${hints}${outcomesParam ? `&outcomes=${outcomesParam}` : ""}&subject=${encodeURIComponent(subject)}&entry=${entry}`;

  const goToRecording = () => router.push(`/recall/concept-questions/session/recording?${query}`);

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

  const handleRevealAnswer = () => {
    const nextOutcomes = appendOutcome(outcomesParam, "revealed");
    router.push(
      `/recall/concept-questions/session/reveal?term=${term}&outcomes=${nextOutcomes}&subject=${encodeURIComponent(subject)}&entry=${entry}`,
    );
  };

  return (
    <Screen>
      <AppBar
        variant="leftAndRightIconButton"
        leftIcon={<XClose />}
        leftAriaLabel="Close"
        onLeftClick={() => router.push(studyPlanCloseUrl(entry, 25))}
        rightIcon={<DotsVertical />}
        rightAriaLabel="More options"
      >
        <div className={styles.progressRow}>
          <div className={styles.progressBar}>
            <ProgressIndicator
              variant="Primary"
              thickness="24"
              progress={PROGRESS_BY_TERM[term - 1]}
              aria-label={`Term ${term} of ${CONCEPT_QUESTIONS_TERMS.length}`}
            />
          </div>
          <span className={styles.termCount} aria-hidden="true">
            {term}/{CONCEPT_QUESTIONS_TERMS.length}
          </span>
          <BadgeChip type="xp" label={String(xpTotal)} />
        </div>
      </AppBar>

      <div className={styles.middleContent}>
        <MascotBubble
          position="Left"
          expression="standby"
          bodyText={bodyText}
          showChip={hints > 0}
          chipText={chipText}
          showButton
          buttonText="Reveal answer"
          onRevealAnswer={handleRevealAnswer}
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
            onSend={() => router.push(`/recall/concept-questions/session/processing?${query}&via=text`)}
          />
        </div>
      </div>
    </Screen>
  );
}
