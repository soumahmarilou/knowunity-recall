"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { BadgeChip } from "@/components/BadgeChip/BadgeChip";
import { ProgressIndicator } from "@/components/ProgressIndicator/ProgressIndicator";
import { MascotBubble } from "@/components/MascotBubble/MascotBubble";
import { Waveform } from "@/components/Waveform/Waveform";
import { MicButton } from "@/components/MicButton/MicButton";
import { ButtonIcon } from "@/components/ButtonIcon/ButtonIcon";
import { ChatInput } from "@/components/ChatInput/ChatInput";
import { TranscriptView } from "@/components/TranscriptView/TranscriptView";
import { XClose, Redo01 } from "@/components/Icons/Icons";
import { useMicLevel } from "@/lib/micLevel";
import { useSpeechTranscript } from "@/lib/speechTranscript";
import { getEntryFromSearchParam } from "@/lib/entryPoint";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import {
  FRC_ASPECTS,
  getAspectFromSearchParam,
  getTotalAspectsFromSearchParam,
  getHintsFromSearchParam,
  getCoverageFromSearchParam,
  getXpFromSearchParam,
  getAspectProgress,
  buildFrcQuery,
} from "../../../frc";
import styles from "./page.module.css";

/**
 * Free Recall Challenge – Aspect to revise – Recording. Same Send/Redo
 * pattern as every other mode's Recording screen (Concept Questions'
 * session/recording in particular, since this sub-flow reuses its ladder
 * mechanic) — FRC's own copy per this build's disclosed Open-item decision.
 */
export function AspectRecordingContent() {
  const router = useRouter();
  usePrefetchRoutes(["/recall/free-recall-challenge/summary/aspect-to-revise/processing"]);
  const searchParams = useSearchParams();
  const aspectIndex = getAspectFromSearchParam(searchParams.get("aspect"));
  const total = getTotalAspectsFromSearchParam(searchParams.get("total"));
  const hints = getHintsFromSearchParam(searchParams.get("hints"));
  const coverage = getCoverageFromSearchParam(searchParams.get("coverage"));
  const xp = getXpFromSearchParam(searchParams.get("xp"));
  const entry = getEntryFromSearchParam(searchParams.get("entry"));
  const aspect = FRC_ASPECTS[aspectIndex - 1];
  const [message, setMessage] = useState("");
  const micLevels = useMicLevel(true);
  // No mocked transcript while the student is typing instead of speaking
  // — per direct instruction, it's meant to read as "what's being heard,"
  // which doesn't apply once they've switched to text.
  const isTyping = message.trim().length > 0;
  const transcript = useSpeechTranscript(!isTyping);

  const bodyText = hints === 0 ? aspect.prompt : aspect.hints[hints - 1].body;
  // Same chip-slot treatment as the Launched-style screen this mirrors —
  // "Aspect you didn't recall" occupies the chip before any hint, per
  // direct instruction.
  const chipText = hints === 0 ? "Aspect you didn't recall" : aspect.hints[hints - 1].chipText;
  // Red for the "you missed this" framing, blue once a hint is actually
  // given — per direct instruction, distinct from the hint-status chip
  // this same slot shows afterward.
  const chipColor = hints === 0 ? "error" : "info";
  const query = buildFrcQuery({ aspect: aspectIndex, total, hints, coverage, xp, entry });

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
          expression="standby"
          bodyText={bodyText}
          showChip
          chipText={chipText}
          chipColor={chipColor}
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
              onClick={() => router.push(`/recall/free-recall-challenge/summary/aspect-to-revise?${query}`)}
            />
            <p className={styles.controlLabel}>Redo</p>
          </div>
          <div className={styles.controlColumn}>
            <MicButton
              state="recording"
              aria-label="Send recording"
              onClick={() =>
                router.push(
                  `/recall/free-recall-challenge/summary/aspect-to-revise/processing?${query}&via=voice`,
                )
              }
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
            onSend={() =>
              router.push(`/recall/free-recall-challenge/summary/aspect-to-revise/processing?${query}&via=text`)
            }
          />
        </div>
      </div>
    </Screen>
  );
}
