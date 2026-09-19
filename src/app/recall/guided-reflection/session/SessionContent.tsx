"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { Button } from "@/components/Button/Button";
import { MascotBubble } from "@/components/MascotBubble/MascotBubble";
import { MicButton } from "@/components/MicButton/MicButton";
import { MicPermissionPrimer } from "@/components/MicPermissionPrimer/MicPermissionPrimer";
import { ChatInput } from "@/components/ChatInput/ChatInput";
import { XClose, DotsVertical } from "@/components/Icons/Icons";
import { useMicPermission } from "@/lib/micPermission";
import { getTermContent, getTermFromSearchParam, getSubjectFromSearchParam } from "../terms";
import { getEntryFromSearchParam, studyPlanCloseUrl } from "@/lib/entryPoint";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
import styles from "./page.module.css";

/**
 * Guided Reflection – Launched. SPEC.md screen 7a
 * (src/app/recall/guided-reflection/session/page.tsx). Figma frame:
 * "Guided Reflection - Launched" (node 13659:5628, Design Deliverables
 * page) for the Idle state — Permission-priming and Mic-disabled have no
 * Figma frame (SPEC.md marks them proposed), built per
 * voice_recall_build_decisions.md instead.
 */
export function GuidedReflectionSessionContent() {
  const router = useRouter();
  usePrefetchRoutes([
    "/recall/guided-reflection/session/recording",
    "/recall/guided-reflection/session/processing",
  ]);
  const searchParams = useSearchParams();
  const term = getTermFromSearchParam(searchParams.get("term"));
  const subject = getSubjectFromSearchParam(searchParams.get("subject"));
  const entry = getEntryFromSearchParam(searchParams.get("entry"));
  const currentTerm = getTermContent(term, subject);

  const { status, requestMicPermission } = useMicPermission();
  const [showPrimer, setShowPrimer] = useState(false);
  const [showReenableHelp, setShowReenableHelp] = useState(false);
  const [message, setMessage] = useState("");

  const query = `term=${term}&subject=${encodeURIComponent(subject)}&entry=${entry}`;

  const goToRecording = () => {
    router.push(`/recall/guided-reflection/session/recording?${query}`);
  };

  const handleMicTap = () => {
    if (status === "granted") {
      goToRecording();
    } else if (status === "unknown") {
      setShowPrimer(true);
    }
    // status === "denied": MicButton renders disabled, this handler can't fire.
  };

  const handlePrimerAllow = async () => {
    const result = await requestMicPermission();
    setShowPrimer(false);
    if (result === "granted") goToRecording();
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
        {/* margin-left:auto inside AppBar's own flex Slot pushes this to
         * the slot's right edge — landing just left of the dots-vertical
         * icon, which sits outside the slot as AppBar's own right element. */}
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
            onSend={() => router.push(`/recall/guided-reflection/session/processing?${query}&via=text`)}
          />
        </div>
      </div>
    </Screen>
  );
}
