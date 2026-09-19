import type { ReactNode } from "react";
import { IconSlot, type IconSlotSize } from "../IconSlot/IconSlot";
import styles from "./ButtonIcon.module.css";

/**
 * Icon-only button. Figma: "buttonIcon" component set (variant x size x state).
 *
 * WHAT IT IS: The icon-only counterpart to button. Same variant grid —
 * variant (Primary/Secondary/Tertiary/Success) x size (S/M/L) x state
 * (Default/Pressed/Disabled/Loading) — but no CTA text or icon-toggle
 * props, since the icon is the whole button. Success is a solid green
 * accent for a completed step, built out to the same full grid as the
 * other three variants, with the same border and inner-shadow treatment
 * as Primary/Secondary at rest. Pressed flattens that inner shadow on
 * Primary/Secondary/Success alike, the same convention button's own
 * Pressed already uses — Tertiary has no fill to inset a shadow onto, so
 * nothing changes there.
 *
 * WHEN TO USE IT: A tappable action with no room or need for a label —
 * nav bar actions, close/back, compact toolbars. Used this way inside
 * appBar's variants. Success specifically marks a step that's already
 * done.
 *
 * DON'T: Don't use it for an action a first-time user can't identify from
 * the icon alone — there's no label to fall back on.
 */

export type ButtonIconVariant = "Primary" | "Secondary" | "Tertiary" | "Success";
export type ButtonIconSize = "S" | "M" | "L";
export type ButtonIconState = "Default" | "Pressed" | "Disabled" | "Loading";

// buttonIcon's own S/M/L sizes each drive a specific IconSlot size step in
// Figma (verified against the real component: S -> icon/200, M -> icon/250,
// L -> icon/300).
const ICON_SLOT_SIZE: Record<ButtonIconSize, IconSlotSize> = {
  S: "200",
  M: "250",
  L: "300",
};

export interface ButtonIconProps {
  variant?: ButtonIconVariant;
  size?: ButtonIconSize;
  state?: ButtonIconState;
  /** The icon itself. Not documented as a Figma prop (no swap property
   * exposed on the component set) — supplied by the consumer since the
   * component has no way to know your icon set. */
  icon: ReactNode;
  /** Required: this button has no visible text, so screen readers rely on
   * this entirely. Figma's own description warns against using this
   * component for anything a first-time user can't identify from the icon
   * alone — an accessible name is the same requirement, not optional. */
  "aria-label": string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function ButtonIcon({
  variant = "Primary",
  size = "S",
  state = "Default",
  icon,
  "aria-label": ariaLabel,
  onClick,
  type = "button",
}: ButtonIconProps) {
  const isDisabled = state === "Disabled";
  const isLoading = state === "Loading";
  const isPressed = state === "Pressed";

  const className = [
    styles.button,
    styles[`variant${variant}`],
    styles[`size${size}`],
    isPressed && styles.pressed,
    // Same reasoning as Button's own `notWired` — see that component.
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
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {isLoading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        <span className={styles.iconWrap}>
          <IconSlot size={ICON_SLOT_SIZE[size]} icon={icon} />
        </span>
      )}
    </button>
  );
}
