import type { ReactNode } from "react";
import styles from "./IconSlot.module.css";

/**
 * Icon-only sizing container. Figma: "iconSlot" component set.
 *
 * WHAT IT IS: A sized container for an icon. One variant, "Size (IGNORE)"
 * (100/150/200/250/300/400 — the name flags it as legacy, not meant for
 * deliberate picking), plus an instance-swap property so any icon
 * component can be dropped in. It's a slot, not an icon itself.
 *
 * WHEN TO USE IT: Anywhere an icon needs a consistent, swappable
 * container — inside buttonIcon, appBar's left/right buttons, list rows,
 * etc. Pick the size step that matches the icon's context.
 *
 * DON'T: Don't be thrown by the "Size (IGNORE)" property name — it's a
 * known leftover, not a new bug. Safe to use as-is.
 */

export type IconSlotSize = "100" | "150" | "200" | "250" | "300" | "400";

export interface IconSlotProps {
  /**
   * Figma's variant is literally named "Size (IGNORE)" — its own
   * description calls that a known leftover label, not a real prop name to
   * propagate. This prop is named `size`; the option values (100–400)
   * match Figma exactly.
   */
  size?: IconSlotSize;
  /** The icon itself, via Figma's instance-swap property. Consumer-supplied. */
  icon: ReactNode;
}

export function IconSlot({ size = "400", icon }: IconSlotProps) {
  const className = [styles.slot, styles[`size${size}`]].join(" ");

  return (
    <span className={className} aria-hidden="true">
      {icon}
    </span>
  );
}
