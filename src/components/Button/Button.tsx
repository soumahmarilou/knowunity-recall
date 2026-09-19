import type { ReactNode } from "react";
import styles from "./Button.module.css";

/**
 * Text button. Figma: "button" component set (variant x size x state).
 *
 * WHAT IT IS: The text button. variant (Primary/Secondary/Tertiary) x size
 * (S/M/L) x state (Default/Pressed/Disabled/Loading), plus a CTA text
 * property and showLeftIcon/showRightIcon booleans for an optional icon on
 * either side.
 *
 * WHEN TO USE IT: Any tappable action that needs a text label. Primary for
 * the one main action on a screen, Secondary/Tertiary for supporting
 * actions.
 *
 * DON'T: Don't skip the Loading state when an action triggers a network
 * call — it's a real variant, not an afterthought.
 */

export type ButtonVariant = "Primary" | "Secondary" | "Tertiary";
export type ButtonSize = "S" | "M" | "L";
export type ButtonState = "Default" | "Pressed" | "Disabled" | "Loading";

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  state?: ButtonState;
  /** Button label. Figma property name: CTA. */
  cta?: string;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  /** Icon content shown when showLeftIcon is true. Not rendered otherwise. */
  leftIcon?: ReactNode;
  /** Icon content shown when showRightIcon is true. Not rendered otherwise. */
  rightIcon?: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function Button({
  variant = "Primary",
  size = "S",
  state = "Default",
  cta = "1/2 words",
  showLeftIcon = false,
  showRightIcon = false,
  leftIcon,
  rightIcon,
  onClick,
  type = "button",
}: ButtonProps) {
  const isDisabled = state === "Disabled";
  const isLoading = state === "Loading";
  const isPressed = state === "Pressed";

  const className = [
    styles.button,
    styles[`variant${variant}`],
    styles[`size${size}`],
    isPressed && styles.pressed,
    // No onClick means tapping this does nothing — not a Figma state,
    // a disclosed prototype gap (some CTAs, e.g. Study plan's "Focus
    // Mode", have no destination yet). Drops the pointer cursor so it
    // doesn't promise an action that isn't there; doesn't touch
    // `disabled` itself, which would also change focus/AT behavior and
    // the button's whole visual state, not just the cursor.
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
      {showLeftIcon && !isLoading && leftIcon && (
        <span className={styles.icon} aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {isLoading && <span className={styles.spinner} aria-hidden="true" />}
      <span className={isLoading ? styles.srOnly : styles.label}>{cta}</span>
      {showRightIcon && !isLoading && rightIcon && (
        <span className={styles.icon} aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
}
