import type { ReactNode } from "react";
import { IconSlot } from "../IconSlot/IconSlot";
import styles from "./NavigationButton.module.css";

/**
 * Bottom nav tab item. Figma: "Navigation Button" component set.
 *
 * Figma's own description field for this component set is empty, and
 * design-system_1.md doesn't document it at all (it's one of the
 * components flagged there as a known gap in that file's coverage) — so
 * unlike most other components built so far, there's no WHAT IT IS / WHEN
 * TO USE IT / DON'T text to show here. Stated plainly rather than
 * invented.
 *
 * What's real, confirmed directly against the Figma component and its
 * rendered states: an icon over a label, State (Inactive/Active) genuinely
 * changes both the icon's color/opacity and the label's color and weight —
 * confirmed by comparing rendered screenshots of both states, not just raw
 * property values. Icon goes through IconSlot (design-system_1.md: "An
 * icon anywhere in the UI. iconSlot. Never place a bare icon frame
 * directly") at size 300 (24px, matching Figma's icon box exactly).
 */

export type NavigationButtonState = "Inactive" | "Active";

export interface NavigationButtonProps {
  /** Figma property name: Label. */
  label?: string;
  /** The icon itself, via Figma's instance-swap "Icon" property. Consumer-supplied. */
  icon: ReactNode;
  /** Figma property name: Has Label. */
  hasLabel?: boolean;
  state?: NavigationButtonState;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function NavigationButton({
  label = "Label",
  icon,
  hasLabel = true,
  state = "Inactive",
  onClick,
  type = "button",
}: NavigationButtonProps) {
  const isActive = state === "Active";

  const className = [styles.button, isActive && styles.active].filter(Boolean).join(" ");

  return (
    <button
      type={type}
      className={className}
      aria-current={isActive ? "page" : undefined}
      onClick={onClick}
    >
      <span className={styles.icon}>
        <IconSlot size="300" icon={icon} />
      </span>
      {hasLabel && <span className={styles.label}>{label}</span>}
    </button>
  );
}
