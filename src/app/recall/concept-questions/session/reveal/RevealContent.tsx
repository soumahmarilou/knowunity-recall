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
import { getEntryFromSearchParam } from "@/lib/entryPoint";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import {
  CONCEPT_QUESTIONS_TERMS,
  XP_BY_OUTCOME,
  PROGRESS_BY_TERM,
  getTermFromSearchParam,
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
 * Nothing here is judged (the answer's already given), so unlike every
 * other mic/chat interaction in this mode, tapping the mic or sending
 * text does not route through Recording/Processing at all — it advances
 * straight to the next term (or Summary, if this was the last one), the
 * same destination "Say it back" used to lead to before it was removed
 * from the mode entirely.
 *
 * The bubble now tells the student what that mic/chat interaction is
 * for, per direct instruction — the answer text is followed by a fixed
 * "Repeat the answer to go to the next question." line, since nothing
 * on screen previously explained why tapping the mic here made sense.
 */
const REPEAT_PROMPT = "Repeat the answer to go to the next question.";

export function ConceptQuestionsRevealContent() {
  const router = useRouter();
  usePrefetchRoutes(["/recall/concept-questions/session", "/recall/concept-questions/summary"]);
  const searchParams = useSearchParams();
  const term = getTermFromSearchParam(searchParams.get("term"));
  const outcomesParam = searchParams.get("outcomes");
  const entry = getEntryFromSearchParam(searchParams.get("entry"));
  const currentTerm = CONCEPT_QUESTIONS_TERMS[term - 1];

  const xpTotal = parseOutcomes(outcomesParam).reduce((sum, o) => sum + XP_BY_OUTCOME[o], 0);
  const [message, setMessage] = useState("");

  const goToNext = () => {
    if (term === CONCEPT_QUESTIONS_TERMS.length) {
      router.push(`/recall/concept-questions/summary?outcomes=${outcomesParam ?? ""}&entry=${entry}`);
    } else {
      router.push(
        `/recall/concept-questions/session?term=${term + 1}&hints=0&outcomes=${outcomesParam ?? ""}&entry=${entry}`,
      );
    }
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
          <MicButton state="idle" aria-label="Repeat the answer" onClick={goToNext} />
          <p className={styles.micLabel}>Tap to repeat</p>
        </div>

        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <p className={styles.dividerText}>or</p>
          <span className={styles.dividerLine} />
        </div>

        <div className={styles.chatInputRow}>
          <ChatInput state="Answer" value={message} onChange={setMessage} onSend={goToNext} />
        </div>
      </div>
    </Screen>
  );
}
