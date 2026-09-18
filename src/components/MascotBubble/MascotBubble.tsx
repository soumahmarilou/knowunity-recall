import Image from "next/image";
import { Chips } from "../Chips/Chips";
import type { Expression } from "../Expressions/Expressions";
import styles from "./MascotBubble.module.css";

/**
 * Knowie's feedback speech bubble. Figma: "Mascot bubble" component set.
 *
 * WHAT IT IS: Knowie's feedback speech bubble: mascot, tail, and message
 * card together. The card can optionally show a status chip and a
 * "Reveal answer" button alongside the feedback text.
 *
 * WHEN TO USE IT: Any screen where Knowie responds to the student in
 * text. Keep Position on Left, that's the layout used on every real
 * recall-feedback screen. Turn Show chip on for a status label like
 * "Almost there," and Show button on when there's an answer to reveal.
 * Body text holds the feedback message itself.
 *
 * DON'T: Don't switch Position to Right without a real reason, it's a
 * mirrored layout with no actual use in the app yet. Don't turn on Show
 * button when there's nothing to reveal, it'll show a dead action that
 * goes nowhere.
 *
 * Composed from the already-built Chips for both the status chip ("Almost
 * there", color=info, size=S, active=True — per direct instruction, this
 * reads as an informational status label, not the same "Primary" white
 * every button uses) and, per direct instruction, "Reveal answer" too
 * (color=Primary, same white as every other button, wrapped in a real
 * button element for interactivity since Chips itself has no onClick) —
 * Figma's own instance there is actually a Button (variant=Primary,
 * size=S), but this intentionally departs from that, disclosed here rather
 * than silently
 * changed.
 *
 * The card's height genuinely collapses to 200 / 164 / 148 / 112 tall
 * depending on which of the chip and button are showing (per
 * design-system_1.md) — reproduced here by conditionally rendering those
 * elements rather than hiding them, so flexbox's own gap collapses the
 * height correctly on its own, no hardcoded heights needed.
 *
 * `expression` (default "approving"): not an exposed Figma property either
 * — same underlying situation as MascotSlot before it got one (see that
 * component's own doc + component-gaps.md). "approving" keeps the
 * original bespoke asset (public/images/mascot-approving.png, exported
 * from Figma's orphaned main component — same situation as Loading01/
 * ChevronRight, see below). Any other value falls back to the shared
 * public/images/expressions/*.png family instead, same asset convention
 * as MascotSlot — those are a different crop/composition than the
 * bespoke approving art (tuned generically, not for this speech-bubble
 * layout specifically), a disclosed, minor fidelity gap for every
 * expression except the default.
 *
 * The speech-bubble tail is a simplified triangle, not the exact Figma
 * vector (which has a 1px rounded tip) — a disclosed, minor fidelity gap.
 *
 * Both the mascot image and the card's own content (chip + body text +
 * button together) fade in on a `key`-forced remount whenever
 * `expression`/`bodyText`/`chipText`/`buttonText` change — per direct
 * instruction, every expression and bubble-content change across the app
 * should read as a smooth transition, not a hard cut. Deliberately a
 * simple fade-and-settle (CSS `animation` on remount), not a real
 * cross-fade — this codebase has no animation library, and a true
 * cross-fade needs the outgoing content to stay mounted mid-transition,
 * which would need one.
 *
 * Revised once already: the first version also slid the content up
 * slightly (translateY) over 350ms — per direct instruction, that read as
 * "the page changed" rather than "this element's own state updated."
 * Opacity-only and short (150ms) now — see build-screen skill's own note
 * on this. Keep any future adjustment here in that same direction, not
 * back toward more motion/duration.
 */

export type MascotBubblePosition = "Left" | "Right";

export interface MascotBubbleProps {
  position?: MascotBubblePosition;
  expression?: Expression;
  /** Figma property name: Show chip. */
  showChip?: boolean;
  /** Figma property name: Show button. */
  showButton?: boolean;
  /** Figma property name: Body text. */
  bodyText?: string;
  /** The chip's own Text property. */
  chipText?: string;
  /** The chip's color — not a real Figma property either (Chips' own
   * `color` axis isn't exposed as a MascotBubble instance-swap), added
   * once a second screen needed the chip to mean something other than
   * "informational status": Free Recall Challenge's aspect-to-revise
   * screen uses "error" (red) for "Aspect you didn't recall", distinct
   * from the "info" (blue) hint-status chip that later occupies this same
   * slot once a hint is given. Defaults to "info", the original/only
   * color this slot ever used before that. */
  chipColor?: "info" | "error";
  /** The button's own label — defaults to "Reveal answer" (its only use
   * until Guided Reflection's acknowledgment beat needed "Next question"
   * instead). Same button, same click handler, just a different label for
   * whatever action actually follows on a given screen. */
  buttonText?: string;
  onRevealAnswer?: () => void;
}

function Tail() {
  return (
    <svg className={styles.tail} width="15" height="19" viewBox="0 0 15 19" fill="none" aria-hidden="true">
      <path d="M 15 0 L 15 19 L 1 10.5 C 0 9.8 0 9.2 1 8.5 Z" fill="var(--color-background-surface)" />
    </svg>
  );
}

export function MascotBubble({
  position = "Left",
  expression = "approving",
  showChip = true,
  showButton = true,
  bodyText = "You’ve identified that we look for common terms, but the rule for how we can actually cancel them out is missing.",
  chipText = "Almost there",
  chipColor = "info",
  buttonText = "Reveal answer",
  onRevealAnswer,
}: MascotBubbleProps) {
  const isRight = position === "Right";
  const mascotSrc =
    expression === "approving" ? "/images/mascot-approving.png" : `/images/expressions/${expression}.png`;

  return (
    <div className={[styles.mascotBubble, isRight && styles.positionRight].filter(Boolean).join(" ")}>
      <span key={expression} className={styles.mascotFade}>
        <Image src={mascotSrc} alt="" width={49} height={52} className={styles.mascot} />
      </span>
      <div className={styles.bubbleGroup}>
        <Tail />
        <div className={styles.card}>
          <div key={`${chipText}|${bodyText}|${buttonText}`} className={styles.cardContentFade}>
            {showChip && (
              <span className={styles.chipWrap}>
                <Chips text={chipText} color={chipColor} size="S" active="True" />
              </span>
            )}
            <div className={styles.bodyGroup}>
              <p className={styles.bodyText}>{bodyText}</p>
              {showButton && (
                <button type="button" className={styles.revealAnswer} onClick={onRevealAnswer}>
                  <Chips text={buttonText} color="Primary" size="S" active="True" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
