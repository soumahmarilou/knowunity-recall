import { Button } from "../Button/Button";
import styles from "./MicPermissionPrimer.module.css";

/**
 * WHAT IT IS: A small confirm card that asks for microphone access before
 * a first recording — "Knowie needs your mic to hear your answer", with
 * "Allow" and "Not now" buttons. Not a Figma/Storybook-cataloged
 * component originally; promoted here after showing up identically,
 * inline, on 4 separate screens (see component-gaps.md).
 *
 * WHEN TO USE IT: Anchored above a `MicButton` the first time a screen
 * needs to ask for mic permission, before the student's first recording
 * attempt on that screen. Render it conditionally (e.g. on an "unknown"
 * permission status) — it positions itself absolutely above its nearest
 * positioned ancestor, it doesn't reserve layout space itself.
 *
 * DON'T: Don't use it for the mic-disabled state (permission already
 * denied) — that's a separate note-plus-link pattern, not this card.
 * Don't restyle its copy per screen; the same line is intentional across
 * every mode.
 */

export interface MicPermissionPrimerProps {
  /** Tapping "Allow" — triggers the real browser permission prompt. */
  onAllow: () => void;
  /** Tapping "Not now" — dismisses the card without requesting permission. */
  onDismiss: () => void;
}

export function MicPermissionPrimer({ onAllow, onDismiss }: MicPermissionPrimerProps) {
  return (
    <div className={styles.primerCard}>
      <p className={styles.primerText}>Knowie needs your mic to hear your answer</p>
      <div className={styles.primerActions}>
        <Button variant="Primary" size="S" cta="Allow" onClick={onAllow} />
        <Button variant="Tertiary" size="S" cta="Not now" onClick={onDismiss} />
      </div>
    </div>
  );
}
