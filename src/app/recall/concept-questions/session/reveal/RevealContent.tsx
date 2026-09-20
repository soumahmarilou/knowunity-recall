"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { ProgressIndicator } from "@/components/ProgressIndicator/ProgressIndicator";
import { BadgeChip } from "@/components/BadgeChip/BadgeChip";
import { MascotBubble } from "@/components/MascotBubble/MascotBubble";
import { MicButton } from "@/components/MicButton/MicButton";
import { ChatInput } from "@/components/ChatInput/ChatInput";
import { XClose, DotsVertical } from "@/components/Icons/Icons";
import { getEntryFromSearchParam, studyPlanCloseUrl } from "@/lib/entryPoint";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import {
  CONCEPT_QUESTIONS_TERMS,
  XP_BY_OUTCOME,
  getTermFromSearchParam,
  getSubjectFromSearchParam,
  getProgressFromOutcomes,
  parseOutcomes,
} from "../../terms";
// Reuses Launched's own page.module.css — same screen, not a separate
// composition (see this component's own doc comment below).
import styles from "../page.module.css";

/**
 * Concept Questions – Reveal. SPEC.md screen 8d, its own route again per
 * direct instruction — an earlier version folded this into Launched's own
 * in-place state instead. Per that same instruction, this is genuinely
 * Launched's own screen, reused, not a differently-composed one: same
 * `AppBar`/progress/XP, same mic + chat-input row — the only differences
 * are the mascot's bubble (no "Reveal answer" button, body text is the
 * term's answer, `expression="confused"`) and what tapping the mic or
 * sending text actually does.
 *
 * Both ways of reaching this screen — the self-service "Reveal answer"
 * tap on Launched, and Processing's automatic forced-reveal after the
 * ladder's 2nd hint — already append the "revealed" outcome to
 * `outcomes` before navigating here, so this screen never appends to it
 * itself, only reads it forward.
 *
 * Tapping the mic or sending text here is a real repeat attempt, per
 * direct instruction — it routes through the same Recording -> Processing
 * screens any other question uses, not a shortcut straight to the next
 * term (an earlier version of this screen skipped Recording/Processing
 * entirely and just advanced; that's been corrected, the mic genuinely
 * records now). But it's not a *re-scored* attempt either — a `repeat=1`
 * flag threads through Recording and into Processing, telling Processing
 * to skip its random pass/hint/reveal roll entirely and always resolve as
 * a guaranteed pass: this term is already concluded (its "revealed"
 * outcome was appended before this screen was ever reached), so a coin
 * flip here could otherwise either silently duplicate that outcome (on a
 * lucky roll) or drop the student into a second, nonsensical hint ladder
 * for an answer they've already been shown (on an unlucky one) — neither
 * is a real "did they say it back correctly" check anyway, since nothing
 * in this app actually judges speech content. Repeating the already-
 * revealed answer is accepted unconditionally, per direct instruction.
 *
 * The bubble still tells the student what tapping the mic here is for —
 * a fixed "Repeat the answer to continue" line, in its own chip below
 * the answer text (`footerChipText`) rather than concatenated onto the
 * end of it, per direct instruction. That copy is a slight
 * simplification (a repeat can also land on another hint or a second
 * reveal if it doesn't go well, same as any other attempt) but stays
 * accurate to the common case and to the on-screen "Tap to repeat"
 * label, so left as-is.
 */
const REPEAT_PROMPT = "Repeat the answer to continue";

export function ConceptQuestionsRevealContent() {
  const router = useRouter();
  usePrefetchRoutes(["/recall/concept-questions/session", "/recall/concept-questions/summary"]);
  const searchParams = useSearchParams();
  const term = getTermFromSearchParam(searchParams.get("term"));
  const outcomesParam = searchParams.get("outcomes");
  const subject = getSubjectFromSearchParam(searchParams.get("subject"));
  const entry = getEntryFromSearchParam(searchParams.get("entry"));
  const currentTerm = CONCEPT_QUESTIONS_TERMS[term - 1];

  const outcomes = parseOutcomes(outcomesParam);
  const xpTotal = outcomes.reduce((sum, o) => sum + XP_BY_OUTCOME[o], 0);
  const [message, setMessage] = useState("");

  // Per direct instruction: repeating the answer is a genuine recording,
  // routed through the same Recording screen any other question uses —
  // but `repeat=1` marks it as a guaranteed-pass confirmation, not a
  // re-scored attempt (see this component's own doc comment above).
  const goToRecording = () => {
    const query = `term=${term}&hints=0&repeat=1${outcomesParam ? `&outcomes=${outcomesParam}` : ""}&subject=${encodeURIComponent(subject)}&entry=${entry}`;
    router.push(`/recall/concept-questions/session/recording?${query}`);
  };

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
              progress={getProgressFromOutcomes(outcomes)}
              aria-label={`Term ${term} of ${CONCEPT_QUESTIONS_TERMS.length}`}
            />
          </div>
          <BadgeChip type="xp" label={String(xpTotal)} />
        </div>
      </AppBar>

      <div className={styles.middleContent}>
        <MascotBubble
          position="Left"
          expression="confused"
          overline={`Question ${term} of ${CONCEPT_QUESTIONS_TERMS.length}`}
          bodyText={currentTerm.revealAnswer}
          footerChipText={REPEAT_PROMPT}
          showChip={false}
          showButton={false}
        />
      </div>

      <div className={styles.bottomContent}>
        <div className={styles.micRow}>
          <MicButton state="idle" aria-label="Repeat the answer" onClick={goToRecording} />
          <p className={styles.micLabel}>Tap to repeat</p>
        </div>

        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <p className={styles.dividerText}>or</p>
          <span className={styles.dividerLine} />
        </div>

        <div className={styles.chatInputRow}>
          <ChatInput state="Answer" value={message} onChange={setMessage} onSend={goToRecording} />
        </div>
      </div>
    </Screen>
  );
}
