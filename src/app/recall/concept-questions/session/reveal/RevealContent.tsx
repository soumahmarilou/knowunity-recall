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
  PROGRESS_BY_TERM,
  getTermFromSearchParam,
  getSubjectFromSearchParam,
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
 * direct instruction — it routes through the exact same Recording ->
 * Processing pipeline any other question uses (`goToRecording`, `hints`
 * reset to 0 for a fresh start of this term's ladder), not a shortcut
 * straight to the next term. An earlier version of this screen skipped
 * Recording/Processing entirely and just advanced — that's been
 * corrected; the mic genuinely records now, "like for all the other
 * questions."
 *
 * The bubble still tells the student what tapping the mic here is for —
 * the answer text is followed by a fixed "Repeat the answer to go to the
 * next question." line. That copy is a slight simplification now (a
 * repeat can also land on another hint or a second reveal if it doesn't
 * go well, same as any other attempt) but stays accurate to the common
 * case and to the on-screen "Tap to repeat" label, so left as-is.
 */
const REPEAT_PROMPT = "Repeat the answer to go to the next question.";

export function ConceptQuestionsRevealContent() {
  const router = useRouter();
  usePrefetchRoutes(["/recall/concept-questions/session", "/recall/concept-questions/summary"]);
  const searchParams = useSearchParams();
  const term = getTermFromSearchParam(searchParams.get("term"));
  const outcomesParam = searchParams.get("outcomes");
  const subject = getSubjectFromSearchParam(searchParams.get("subject"));
  const entry = getEntryFromSearchParam(searchParams.get("entry"));
  const currentTerm = CONCEPT_QUESTIONS_TERMS[term - 1];

  const xpTotal = parseOutcomes(outcomesParam).reduce((sum, o) => sum + XP_BY_OUTCOME[o], 0);
  const [message, setMessage] = useState("");

  // Per direct instruction: repeating the answer is a genuine new attempt
  // at this same term, not just navigation — routes into the same
  // Recording screen any other question uses (hints=0, a fresh start of
  // the ladder for this term), matching Session's own goToRecording query
  // shape exactly. From there the existing Recording -> Processing
  // pipeline decides what happens next (pass advances to the next term/
  // summary same as always; a miss shows a hint or forces reveal again),
  // the same as any other question — nothing special-cased here.
  const goToRecording = () => {
    const query = `term=${term}&hints=0${outcomesParam ? `&outcomes=${outcomesParam}` : ""}&subject=${encodeURIComponent(subject)}&entry=${entry}`;
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
          expression="confused"
          bodyText={`${currentTerm.revealAnswer} ${REPEAT_PROMPT}`}
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
