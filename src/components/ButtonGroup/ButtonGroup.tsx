import type { ReactNode } from "react";
import styles from "./ButtonGroup.module.css";

/**
 * Layout wrapper for grouping buttons. Figma: "buttonGroup" component set.
 *
 * WHAT IT IS: A layout wrapper for grouping buttons. variant
 * (Horizontal/Vertical) x size (M/L). It arranges child button instances,
 * it doesn't create new buttons itself.
 *
 * WHEN TO USE IT: Whenever 2+ buttons need to sit together with
 * consistent spacing — e.g. a confirm+cancel pair, or stacked CTAs in a
 * bottom sheet. Use Vertical when horizontal space is tight or both
 * actions need equal weight.
 *
 * DON'T: Don't use it for a single button — just place the button
 * directly.
 */

export type ButtonGroupVariant = "Horizontal" | "Vertical";
export type ButtonGroupSize = "M" | "L";

export interface ButtonGroupProps {
  variant?: ButtonGroupVariant;
  size?: ButtonGroupSize;
  children: ReactNode;
}

export function ButtonGroup({
  variant = "Vertical",
  size = "M",
  children,
}: ButtonGroupProps) {
  const className = [
    styles.group,
    styles[variant.toLowerCase() as "horizontal" | "vertical"],
    styles[`size${size}`],
  ].join(" ");

  return <div className={className}>{children}</div>;
}
