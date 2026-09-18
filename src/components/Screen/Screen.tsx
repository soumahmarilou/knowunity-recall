import type { ReactNode } from "react";
import styles from "./Screen.module.css";

/**
 * The outer shell every screen in this prototype was hand-building
 * identically six times (src/app/**\/page.module.css each had their own
 * copy of this exact rule). Not the same thing as Figma's real "scaffold"
 * component — that one owns named topNavigation/middleContent/
 * bottomContent/bottomSheetOnly slots, visibility booleans, and a size
 * variant for different device frames (see design-system_1.md), none of
 * which this replicates. This is just the outer frame: fixed mobile
 * width, full viewport height, page background. Everything inside is
 * still freely composed per screen — AppBar, content, nav bar, or none of
 * that, exactly as before.
 *
 * WHAT IT IS: A 390px-wide, full-height, dark-background page shell.
 *
 * WHEN TO USE IT: Wrap every screen's root in this instead of hand-rolling
 * `width: 390px; min-height: 100dvh; margin: 0 auto; background:
 * var(--color-background-page);` per page.
 *
 * DON'T: Don't expect this to provide any layout structure beyond the
 * outer frame — no slots, no nav bar, no safe-area handling beyond what's
 * already in each screen's own CSS.
 */
export interface ScreenProps {
  children: ReactNode;
  /** A handful of screens need their own root-level gap/padding on top of
   * this shell (e.g. a root flex gap substituting for an unbound Figma
   * value, or extra bottom safe-area padding under a pinned button) —
   * layered on via an additional class from the page's own CSS module
   * rather than exposed as a variant here, since these page-by-page.  */
  className?: string;
}

export function Screen({ children, className }: ScreenProps) {
  return <div className={[styles.screen, className].filter(Boolean).join(" ")}>{children}</div>;
}
