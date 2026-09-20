import type { ReactNode } from "react";
import styles from "./IconBadge.module.css";

/**
 * Icon-on-a-colored-background badge. Figma: "Icon badge" component set.
 *
 * WHAT IT IS: An icon-on-a-colored-background badge. 5 color variants
 * (1/2/3/4/brand, matching this file's accent buckets) plus an
 * instance-swap Icon property (default graduation-hat-01). `size` (S/M/L):
 * S is the original 32×32 (icon 20×20) — Figma's only size until M and L
 * were added here per direct instruction. L is a hero-scale badge
 * (120×120, icon 64×64, radius scaled up to match) to replace a
 * mascot-sized slot on a screen — same footprint as `MascotSlot`'s own
 * `2XL` step (`spacing-3000`), so it drops into that same hero position
 * cleanly. M (36×36, icon 24×24) sits between the two — a small step up
 * from S for a context that needs a touch more visual weight without
 * jumping to hero scale (the mode Intro screens' own icon+name eyebrow).
 * S and L stay on icon-scale/spacing-scale tokens respectively (24px is
 * the icon scale's real ceiling below M's own 36px, so M and L both use
 * spacing-scale tokens instead — same disclosed precedent as other large
 * decorative badges in this app, e.g. Study plan's exam badge).
 *
 * Renamed from the original M/L: M used to mean what S means now (the
 * original 32×32) — renamed rather than left as a gap, so introducing a
 * real "slightly bigger than the original" step didn't mean reusing the
 * same letter for two different sizes. Every caller that relied on the
 * default (no explicit `size`) is unaffected — the default value itself
 * was renamed alongside it, still resolving to the same 32×32.
 *
 * WHEN TO USE IT: Wherever an icon needs to read as a colored badge
 * rather than a bare glyph. S is Superlist item's leading icon (and this
 * component's own default). M is the mode Intro screens' icon+name
 * eyebrow. L is for a hero moment where the icon itself carries the
 * identity a mascot would otherwise occupy.
 *
 * DON'T: Don't expect a color set here to follow a parent component's own
 * color automatically — color lives entirely in which variant of this
 * badge is placed.
 */

export type IconBadgeColor = "1" | "2" | "3" | "4" | "brand";
export type IconBadgeSize = "S" | "M" | "L";

export interface IconBadgeProps {
  color?: IconBadgeColor;
  size?: IconBadgeSize;
  /** The icon itself, via Figma's instance-swap property. Consumer-supplied
   * — pair it with a `color` that actually matches the icon's own tint,
   * per the component's own DON'T above; nothing here recolors it for you. */
  icon: ReactNode;
}

export function IconBadge({ color = "1", size = "S", icon }: IconBadgeProps) {
  const colorClass = color === "brand" ? styles.colorBrand : styles[`color${color}`];
  const className = [styles.badge, colorClass, styles[`size${size}`]].join(" ");

  return (
    <span className={className} aria-hidden="true">
      <span className={styles.icon}>{icon}</span>
    </span>
  );
}
