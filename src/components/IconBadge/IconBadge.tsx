import type { ReactNode } from "react";
import styles from "./IconBadge.module.css";

/**
 * Icon-on-a-colored-background badge. Figma: "Icon badge" component set.
 *
 * WHAT IT IS: A 32×32 icon-on-a-colored-background badge. 5 color
 * variants (1/2/3/4/brand, matching this file's accent buckets) plus an
 * instance-swap Icon property (default graduation-hat-01).
 *
 * WHEN TO USE IT: Wherever an icon needs to read as a small colored badge
 * rather than a bare glyph. Currently used as Superlist item's leading
 * icon.
 *
 * DON'T: Don't expect a color set here to follow a parent component's own
 * color automatically — color lives entirely in which variant of this
 * badge is placed.
 */

export type IconBadgeColor = "1" | "2" | "3" | "4" | "brand";

export interface IconBadgeProps {
  color?: IconBadgeColor;
  /** The icon itself, via Figma's instance-swap property. Consumer-supplied
   * — pair it with a `color` that actually matches the icon's own tint,
   * per the component's own DON'T above; nothing here recolors it for you. */
  icon: ReactNode;
}

export function IconBadge({ color = "1", icon }: IconBadgeProps) {
  const colorClass = color === "brand" ? styles.colorBrand : styles[`color${color}`];
  const className = [styles.badge, colorClass].join(" ");

  return (
    <span className={className} aria-hidden="true">
      <span className={styles.icon}>{icon}</span>
    </span>
  );
}
