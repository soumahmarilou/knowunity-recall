"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { ProgressIndicator, type ProgressIndicatorValue } from "@/components/ProgressIndicator/ProgressIndicator";
import { BadgeChip } from "@/components/BadgeChip/BadgeChip";
import { MascotBubble } from "@/components/MascotBubble/MascotBubble";
import { Waveform } from "@/components/Waveform/Waveform";
import { MicButton } from "@/components/MicButton/MicButton";
import { ButtonIcon } from "@/components/ButtonIcon/ButtonIcon";
import { ChatInput } from "@/components/ChatInput/ChatInput";
import { TranscriptView } from "@/components/TranscriptView/TranscriptView";
import { XClose, DotsVertical, Redo01 } from "@/components/Icons/Icons";
import { useMicLevel } from "@/lib/micLevel";
import { useSpeechTranscript } from "@/lib/speechTranscript";
import { getEntryFromSearchParam } from "@/lib/entryPoint";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import {
  CONCEPT_QUESTIONS_TERMS,
  XP_BY_OUTCOME,
  getTermFromSearchParam,
  getHintsFromSearchParam,
  parseOutcomes,
} from "../../terms";
import styles from "./page.module.css";

const PROGRESS_BY_TERM: ProgressIndicatorValue[] = ["0", "25", "75"];

/**
 * Concept Questions – Recording. SPEC.md screen 8b — "mirrors Guided
 * Reflection's Recording 1:1." No dedicated Figma frame for this specific
 * screen was captured this session; built from the same confirmed
 * Recording pattern as Guided Reflection.
 */
export function ConceptQuestionsRecordingContent() {
  const router = useRouter();
  usePrefetchRoutes(["/recall/concept-questions/session/processing"]);
  const searchParams = useSearchParams();
  const term = getTermFromSearchParam(searchParams.get("term"));
  const hints = getHintsFromSearchParam(searchParams.get("hints"));
  const outcomesParam = searchParams.get("outcomes");
  const entry = getEntryFromSearchParam(searchParams.get("entry"));
  const currentTerm = CONCEPT_QUESTIONS_TERMS[term - 1];
  const [message, setMessage] = useState("");
  const micLevels = useMicLevel(true);
  // No mocked transcript while the student is typing instead of speaking
  // — per direct instruction, it's meant to read as "what's being heard,"
  // which doesn't apply once they've switched to text.
  const isTyping = message.trim().length > 0;
  const transcript = useSpeechTranscript(!isTyping);

  const xpTotal = parseOutcomes(outcomesParam).reduce((sum, o) => sum + XP_BY_OUTCOME[o], 0);
  const bodyText = hints === 0 ? currentTerm.prompt : currentTerm.hints[hints - 1].body;
  const chipText = hints === 0 ? undefined : currentTerm.hints[hints - 1].chipText;
  const query = `term=${term}&hints=${hints}${outcomesParam ? `&outcomes=${outcomesParam}` : ""}&entry=${entry}`;

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
          expression="standby"
          bodyText={bodyText}
          showChip={hints > 0}
          chipText={chipText}
          showButton={false}
        />
      </div>

      <div className={styles.bottomContent}>
        {/* Above the waveform, not wedged between it and the controls —
           when there's no text yet (recognition hasn't caught real
           speech), TranscriptView's reserved empty space sits up here
           instead of pushing the waveform away from its controls. */}
        <TranscriptView text={transcript} />

        <div className={styles.waveformRow}>
          <Waveform levels={micLevels} />
        </div>

        <div className={styles.controlsRow}>
          <div className={styles.controlColumn}>
            <ButtonIcon
              variant="Secondary"
              size="L"
              icon={<Redo01 />}
              aria-label="Redo"
              onClick={() => router.push(`/recall/concept-questions/session?${query}`)}
            />
            <p className={styles.controlLabel}>Redo</p>
          </div>
          <div className={styles.controlColumn}>
            <MicButton
              state="recording"
              aria-label="Send recording"
              onClick={() => router.push(`/recall/concept-questions/session/processing?${query}`)}
            />
            <p className={styles.controlLabel}>Send</p>
          </div>
          {/* Invisible mirror of the Redo column — keeps Send anchored at
             the row's true center regardless of Redo's own width. */}
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
            onChange={setMessage}
            onSend={() => router.push(`/recall/concept-questions/session/processing?${query}&via=text`)}
          />
        </div>
      </div>
    </Screen>
  );
}
