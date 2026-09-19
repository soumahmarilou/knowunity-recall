"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { Button } from "@/components/Button/Button";
import { MascotBubble } from "@/components/MascotBubble/MascotBubble";
import { Waveform } from "@/components/Waveform/Waveform";
import { MicButton } from "@/components/MicButton/MicButton";
import { ButtonIcon } from "@/components/ButtonIcon/ButtonIcon";
import { ChatInput } from "@/components/ChatInput/ChatInput";
import { TranscriptView } from "@/components/TranscriptView/TranscriptView";
import { XClose, DotsVertical, Redo01 } from "@/components/Icons/Icons";
import { useMicLevel } from "@/lib/micLevel";
import { useSpeechTranscript } from "@/lib/speechTranscript";
import { getTermContent, getTermFromSearchParam, getSubjectFromSearchParam } from "../../terms";
import { getEntryFromSearchParam, studyPlanCloseUrl } from "@/lib/entryPoint";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import styles from "./page.module.css";

/**
 * Guided Reflection – Recording. SPEC.md screen 7b
 * (src/app/recall/guided-reflection/session/recording/page.tsx). Figma
 * frame: "Guided Reflection - Recording" (node 13826:10742, Design
 * Deliverables page).
 */
export function GuidedReflectionRecordingContent() {
  const router = useRouter();
  usePrefetchRoutes(["/recall/guided-reflection/session/processing"]);
  const searchParams = useSearchParams();
  const term = getTermFromSearchParam(searchParams.get("term"));
  const subject = getSubjectFromSearchParam(searchParams.get("subject"));
  const entry = getEntryFromSearchParam(searchParams.get("entry"));
  const currentTerm = getTermContent(term, subject);
  const [message, setMessage] = useState("");
  const micLevels = useMicLevel(true);
  // No mocked transcript while the student is typing instead of speaking
  // — per direct instruction, it's meant to read as "what's being heard,"
  // which doesn't apply once they've switched to text.
  const isTyping = message.trim().length > 0;
  const transcript = useSpeechTranscript(!isTyping);
  const query = `term=${term}&subject=${encodeURIComponent(subject)}&entry=${entry}`;

  return (
    <Screen>
      <AppBar
        variant="leftAndRightIconButton"
        leftIcon={<XClose />}
        leftAriaLabel="Close"
        onLeftClick={() => router.push(studyPlanCloseUrl(entry, 50))}
        rightIcon={<DotsVertical />}
        rightAriaLabel="More options"
      >
        <div className={styles.finishWrap}>
          <Button
            variant="Primary"
            size="S"
            cta="Finish"
            onClick={() =>
              router.push(
                `/recall/guided-reflection/summary?subject=${encodeURIComponent(subject)}&entry=${entry}`,
              )
            }
          />
        </div>
      </AppBar>

      <div className={styles.middleContent}>
        <MascotBubble
          position="Left"
          expression="standby"
          bodyText={currentTerm.prompt}
          showChip={false}
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
              onClick={() => router.push(`/recall/guided-reflection/session?${query}`)}
            />
            <p className={styles.controlLabel}>Redo</p>
          </div>
          <div className={styles.controlColumn}>
            {/* "Send recording", not just "Send" — ChatInput's own send
             * button is also visible on this screen with the same default
             * label, and two controls sharing one accessible name on the
             * same page is a real (if minor) a11y ambiguity. */}
            <MicButton
              state="recording"
              aria-label="Send recording"
              onClick={() => router.push(`/recall/guided-reflection/session/processing?${query}`)}
            />
            <p className={styles.controlLabel}>Send</p>
          </div>
          {/* Invisible mirror of the Redo column — keeps Send/the mic
             button anchored at the row's true center regardless of Redo's
             own width, so it never shifts position. Per direct
             instruction: "the recording button should never move." */}
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
            onSend={() => router.push(`/recall/guided-reflection/session/processing?${query}&via=text`)}
          />
        </div>
      </div>
    </Screen>
  );
}
