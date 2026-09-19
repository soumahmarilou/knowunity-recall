import styles from "./AppBarButton.module.css";

/**
 * Text-only CTA button used on the right side of an App Bar. Figma:
 * "App Bar Button" component set.
 *
 * Figma's own description field for this component set is empty, and
 * design-system_1.md only documents the general `appBar` concept, not this
 * specific sub-component — so unlike most other components built so far,
 * there's no WHAT IT IS / WHEN TO USE IT / DON'T text to show here. Stated
 * plainly rather than invented.
 *
 * What's real, confirmed directly against the Figma component: a
 * transparent, borderless, no-padding text button, 40px tall, fully
 * rounded. Visually close to Button's Tertiary variant, but a genuinely
 * separate component in Figma with one real difference — Pressed actually
 * dims the label (text/primary -> text/secondary), where Button's Tertiary
 * keeps the same color when pressed.
 */

// Figma defines exactly one "variant" option ("text") — included as a prop
// for fidelity to the instruction, even though it can only ever be this
// one value today.
export type AppBarButtonVariant = "text";
export type AppBarButtonState = "Default" | "Pressed" | "Disabled" | "Loading";

export interface AppBarButtonProps {
  variant?: AppBarButtonVariant;
  state?: AppBarButtonState;
  /** Button label. Figma property name: Text. */
  cta: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

// `variant` is part of the props type for fidelity (Figma defines that
// axis), but it's not destructured below — it can only ever be "text"
// today, so there's nothing for render logic to branch on.
export function AppBarButton({
  state = "Default",
  cta,
  onClick,
  type = "button",
}: AppBarButtonProps) {
  const isDisabled = state === "Disabled";
  const isLoading = state === "Loading";
  const isPressed = state === "Pressed";

  const className = [
    styles.button,
    isPressed && styles.pressed,
    // No onClick wired — see Button.tsx's own comment on `notWired`.
    !onClick && !isDisabled && !isLoading && styles.notWired,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={className}
      disabled={isDisabled || isLoading}
      aria-busy={isLoading || undefined}
      onClick={onClick}
    >
      {isLoading && <span className={styles.spinner} aria-hidden="true" />}
      <span className={isLoading ? styles.srOnly : undefined}>{cta}</span>
    </button>
  );
}
