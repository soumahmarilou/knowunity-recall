import type { ReactNode } from "react";
import styles from "./AppBarButtonIcon.module.css";

/**
 * Icon-only button for the app bar. Figma: "App Bar Button Icon"
 * component set.
 *
 * Figma's own description field for this component set is empty, and
 * design-system_1.md only documents the general `appBar` concept, not
 * this specific sub-component — so unlike every other component built so
 * far, there's no WHAT IT IS / WHEN TO USE IT / DON'T text to show here.
 * Stated plainly rather than invented.
 *
 * What's real, confirmed directly against the Figma component: a
 * transparent, borderless 48x48 icon button — visually identical to
 * ButtonIcon's Tertiary variant at rest, but with two real differences:
 * Pressed actually dims the icon (text/primary -> text/secondary), and
 * Loading swaps to a dedicated icon asset rather than a spinner overlay
 * (that asset couldn't be exported — see AppBarButtonIcon.module.css).
 */

// Figma defines exactly one "variant" option ("default") — included as a
// prop for fidelity to the instruction, even though it can only ever be
// this one value today.
export type AppBarButtonIconVariant = "default";
export type AppBarButtonIconState = "Default" | "Pressed" | "Disabled" | "Loading";

export interface AppBarButtonIconProps {
  variant?: AppBarButtonIconVariant;
  state?: AppBarButtonIconState;
  /** The icon itself. Consumer-supplied — see the currentColor override
   * note in AppBarButtonIcon.module.css for why this works even with
   * this project's fixed-fill icon set. */
  icon: ReactNode;
  "aria-label": string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

// `variant` is part of the props type for fidelity (Figma defines that
// axis), but it's not destructured below — it can only ever be
// "default" today, so there's nothing for render logic to branch on.
export function AppBarButtonIcon({
  state = "Default",
  icon,
  "aria-label": ariaLabel,
  onClick,
  type = "button",
}: AppBarButtonIconProps) {
  const isDisabled = state === "Disabled";
  const isLoading = state === "Loading";
  const isPressed = state === "Pressed";

  const className = [styles.button, isPressed && styles.pressed].filter(Boolean).join(" ");

  return (
    <button
      type={type}
      className={className}
      disabled={isDisabled || isLoading}
      aria-busy={isLoading || undefined}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {isLoading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
}
