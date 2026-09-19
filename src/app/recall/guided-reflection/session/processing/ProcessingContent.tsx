"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Screen } from "@/components/Screen/Screen";
import { AppBar } from "@/components/AppBar/AppBar";
import { Button } from "@/components/Button/Button";
import { MascotBubble } from "@/components/MascotBubble/MascotBubble";
import { MicButton } from "@/components/MicButton/MicButton";
import { ButtonIcon } from "@/components/ButtonIcon/ButtonIcon";
import { ChatInput } from "@/components/ChatInput/ChatInput";
import { XClose, DotsVertical, Redo01 } from "@/components/Icons/Icons";
import { getTermFromSearchParam, getSubjectFromSearchParam } from "../../terms";
import { getEntryFromSearchParam, studyPlanCloseUrl } from "@/lib/entryPoint";
import { usePrefetchRoutes } from "@/lib/prefetchRoutes";
// Reuses Recording's own page.module.css rather than a copy — per Marilou's
// standing fix-routing rule, this was raised as a fix: Processing was
// stripping the AppBar's right-side controls and the whole bottom row
// (waveform/controls/chat input), so the screen visibly restructured
// itself the instant a recording was sent. Importing the sibling's actual
// stylesheet (not a duplicate) guarantees the two screens stay
// structurally identical by construction, not by copy-paste that could
// drift later.
import styles from "../recording/page.module.css";

// No <4s STT+judge round-trip actually happens (recall is mocked) — this
// is a deliberately shorter "thinking" beat than voice-ux.md Principle 6's
// full latency target, since Guided Reflection never judges anything;
// long enough to register as a real pause, short enough not to feel slow.
const PROCESSING_DELAY_MS = 1500;

// Guided Reflection's own "warm acknowledgment beat" — voice_recall_build_
// decisions.md calls for one but it was never actually built as a visible
// screen (Processing just auto-advanced straight to the next prompt). Per
// direct instruction: deliberately non-judgmental — validates that sharing
// a perspective shows understanding, never says "correct" or "pass" (this
// mode's own hard rule: zero pass/fail language, ever). Same beat regardless
// of term, matching how "Thinking…" itself doesn't vary by term either.
const ACKNOWLEDGMENT_TEXT =
  "Nice! Being able to share your own take on this part of the course really shows you've got a good handle on it.";

/**
 * Guided Reflection – Processing. SPEC.md screen 7c — explicitly marked
 * "new — not yet in Figma or Storybook as a composed screen." Built from
 * SPEC.md's own description (MascotBubble + Expressions thinking, status
 * text) plus voice-ux.md Principle 6 ("show a clear, calm thinking state").
 * Two phases: "thinking" auto-advances into "acknowledging" after
 * PROCESSING_DELAY_MS; "acknowledging" then waits for the student's own
 * "Next question" tap rather than auto-advancing — per direct instruction,
 * this beat is the moment they're actually asked to move on, not a passive
 * pause.
 *
 * The session loops now, not a fixed 3 terms (see terms.ts's header
 * comment) — "Next question" always advances to `term + 1`, no last-term
 * branch to Summary anymore. Only the AppBar's "Finish" ends it.
 *
 * Expression per phase, per direct instruction: "thinking" while thinking,
 * "approving" once acknowledging — Guided Reflection never has a bad
 * outcome to show anything else for.
 *
 * `via=text` (per direct instruction): when the answer was sent from the
 * chat input rather than the mic, the loading animation belongs in the
 * chat input's own send button, not the recording button — the mic
 * button skips straight to its resting "sent" look (no spin), and
 * ChatInput gets `sending` instead, only for the thinking beat.
 */
export function GuidedReflectionProcessingContent() {
  const router = useRouter();
  usePrefetchRoutes(["/recall/guided-reflection/session", "/recall/guided-reflection/summary"]);
  const searchParams = useSearchParams();
  const term = getTermFromSearchParam(searchParams.get("term"));
  const subject = getSubjectFromSearchParam(searchParams.get("subject"));
  const entry = getEntryFromSearchParam(searchParams.get("entry"));
  const sentViaText = searchParams.get("via") === "text";
  const [message] = useState("");
  const [phase, setPhase] = useState<"thinking" | "acknowledging">("thinking");

  useEffect(() => {
    const timer = setTimeout(() => setPhase("acknowledging"), PROCESSING_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const goToNext = () => {
    router.push(
      `/recall/guided-reflection/session?term=${term + 1}&subject=${encodeURIComponent(subject)}&entry=${entry}`,
    );
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
        <div className={styles.finishWrap}>
          {/* Always clickable, per direct instruction — Processing is a
             brief auto-advancing beat, not a state that should block the
             one way GR's loop actually ends. Same destination as every
             other screen in this mode's own Finish button. */}
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
        {phase === "thinking" ? (
          <MascotBubble
            position="Left"
            expression="thinking"
            bodyText="Thinking…"
            showChip={false}
            showButton={false}
          />
        ) : (
          <MascotBubble
            position="Left"
            expression="approving"
            bodyText={ACKNOWLEDGMENT_TEXT}
            showChip={false}
            showButton
            buttonText="Next question"
            onRevealAnswer={goToNext}
          />
        )}
      </div>

      <div className={styles.bottomContent}>
        {/* No waveform here — that's a recording-in-progress visual, and
           the recording is already sent by the time this screen shows.
           Per direct instruction, once sent nothing "in motion" like that
           should still be on screen. */}
        <div className={styles.controlsRow}>
          <div className={styles.controlColumn}>
            <ButtonIcon variant="Secondary" size="L" icon={<Redo01 />} aria-label="Redo" state="Disabled" />
            <p className={styles.controlLabel}>Redo</p>
          </div>
          <div className={styles.controlColumn}>
            {/* Spins only for the "thinking" beat (well under 2s) — once
               that ends, whether it lands on "acknowledging" or navigates
               away, the button is done sending: greyed out, check icon,
               "Sent" label. Stays disabled either way — GR only allows
               moving on via the "Next question" tap, never by touching
               the recording controls again. Sent via text skips the spin
               entirely — the chat input's own send button animates
               instead (see the ChatInput below). */}
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
          {/* Genuinely disabled throughout Processing, not just visually
             inert via a no-op onChange (that left the textarea actually
             typable) — per direct instruction, matches MicButton's own
             disabled-the-whole-screen behavior above: the student can't
             touch either input again until "Next question" (see the
             MascotBubble render below, phase === "acknowledging"). Not
             phase-conditional — Knowie is either still thinking about or
             has just reacted to the answer for this screen's entire
             lifetime. */}
          <ChatInput
            state="Answer"
            value={message}
            onChange={() => {}}
            sending={sentViaText && phase === "thinking"}
            disabled
          />
        </div>
      </div>
    </Screen>
  );
}
