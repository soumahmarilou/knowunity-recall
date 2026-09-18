import type { ReactNode } from "react";
import { IconSlot } from "../IconSlot/IconSlot";
import { Lightning01 } from "../Icons/Icons";
import styles from "./StatBox.module.css";

/**
 * A stat display box. Figma: "Stat box" component set.
 *
 * WHAT IT IS: A stat display box (icon + number). Icon is an instance-swap
 * property (default lightning-01; target-04 and flame-01 are also
 * common). Color is set per-instance via a variable mode (collection
 * "Stat box accent", modes 1-4 + brand), not a variant — default is mode
 * 3 (blue).
 *
 * WHEN TO USE IT: A single at-a-glance number with a label — streaks, XP,
 * session counts.
 *
 * DON'T: Don't expect the icon to automatically match the box's color —
 * the Icon property is shared across all color modes, so pick one whose
 * native color fits, or accept the mismatch.
 *
 * Icon goes through IconSlot (design-system_1.md: "An icon anywhere in
 * the UI. iconSlot. Never place a bare icon frame directly") at size 300
 * (24px, matching Figma's icon size exactly). Confirmed directly against
 * Figma: the icon's own fill is hardcoded to its own accent color (e.g.
 * Lightning01 already bakes in accent/3/bold), never bound to the "Stat
 * box accent" mode — exactly the mismatch the DON'T above warns about, so
 * `color` here only ever affects the box background, label and number,
 * never the icon itself.
 *
 * `color` isn't a real Figma variant (no componentPropertyDefinitions
 * entry for it — it's a variable mode, a different Figma mechanism), but
 * it's the only way to control the component's color, so it's exposed
 * here using the mode's own names (1-4, brand) per the description.
 */

export type StatBoxColor = "1" | "2" | "3" | "4" | "brand";

export interface StatBoxProps {
  /** The icon itself, via Figma's instance-swap "Icon" property. Consumer-supplied. */
  icon?: ReactNode;
  /** Figma layer name: Label text. Not an exposed Figma property (a
   * per-instance text override), so a free string — default matches
   * Figma's own example. */
  label?: string;
  /** Figma layer name: Value. Not an exposed Figma property (a
   * per-instance text override), so a free string — default matches
   * Figma's own example. */
  value?: string;
  color?: StatBoxColor;
}

export function StatBox({
  icon = <Lightning01 />,
  label = "XP",
  value = "11",
  color = "3",
}: StatBoxProps) {
  const suffix = color === "brand" ? "Brand" : color;

  return (
    <div className={[styles.statBox, styles[`color${suffix}`]].join(" ")}>
      <span className={[styles.label, styles[`label${suffix}`]].join(" ")}>{label}</span>
      <div className={styles.content}>
        <IconSlot size="300" icon={icon} />
        <span className={[styles.value, styles[`value${suffix}`]].join(" ")}>{value}</span>
      </div>
    </div>
  );
}
