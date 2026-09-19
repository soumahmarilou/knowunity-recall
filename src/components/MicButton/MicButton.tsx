import { Check01, Loading01, Microphone01 } from "../Icons/Icons";
import styles from "./MicButton.module.css";

/**
 * micButton — the primary tap target that starts voice capture on a
 * Launched screen. Figma: "micButton" component set.
 *
 * WHAT IT IS: micButton — the primary tap target that starts voice capture
 * on a Launched screen. Four states (idle/recording/processing/disabled),
 * each with its own fill/icon combination. Always pair it with the
 * microphone-01 icon for idle; never swap in a different icon or reuse the
 * shape for another action.
 *
 * WHEN TO USE IT: idle to prompt a tap-to-record. recording once capture
 * starts (icon swaps to check-01, tap to send — no waveform or timer on
 * the button itself). processing while the answer is being sent (icon
 * swaps to the shared loading-01 component). disabled when voice input
 * isn't available (reuses button/buttonIcon's own Disabled tokens).
 *
 * `sent` (added per direct instruction, not a Figma variant): the moment
 * right after `processing` — greyed out like `disabled`, but keeps the
 * check-01 confirmation icon instead of reverting to the microphone, so a
 * completed send still reads as "done," not as "voice unavailable."
 * Pair it with a "Sent" label under the button (the caller's own text, not
 * this component's job) instead of "Send".
 *
 * DON'T: Don't treat processing as final — the state spec places the real
 * send/processing animation under the mascot, not on this button, so this
 * variant is a placeholder until confirmed. Don't expect a discard icon
 * next to recording — trash-01 exists in the icon library but has no
 * container built here yet. Icon is hardcoded per state, not an
 * instance-swap property.
 */

export type MicButtonState = "idle" | "recording" | "disabled" | "processing" | "sent";

export interface MicButtonProps {
  state?: MicButtonState;
  /** Required — this is an icon-only tap target with no visible label. */
  "aria-label": string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function MicButton({
  state = "idle",
  "aria-label": ariaLabel,
  onClick,
  type = "button",
}: MicButtonProps) {
  const isDisabled = state === "disabled" || state === "sent";
  const isProcessing = state === "processing";

  const className = [
    styles.button,
    // No onClick wired — see Button.tsx's own comment on `notWired`.
    !onClick && !isDisabled && !isProcessing && styles.notWired,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={className}
      disabled={isDisabled || isProcessing}
      aria-busy={isProcessing || undefined}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <span className={[styles.icon, isProcessing && styles.spinning].filter(Boolean).join(" ")}>
        {state === "recording" || state === "sent" ? (
          <Check01 />
        ) : isProcessing ? (
          <Loading01 />
        ) : (
          <Microphone01 />
        )}
      </span>
    </button>
  );
}
