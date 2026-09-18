import styles from "./Avatar.module.css";

/**
 * The student's profile avatar. Figma: "Avatar" component set — not
 * ported to code before now (flagged in SPEC.md as missing, needed for
 * Home chat – Default's nav bar).
 *
 * WHAT IT IS: A round avatar badge. Figma's own instance on Home chat –
 * Default is Type=Image, Size=Large, Shape=Circle, with an Initials
 * fallback value ("H") also set. Only that one instance was ever
 * inspected (Figma's Desktop Bridge was disconnected for this build — see
 * component-gaps.md) — `size` and `shape` are typed here for fidelity to
 * that instance, same as AppBarButtonIcon's single-value `variant`, not
 * because other values are confirmed to exist.
 *
 * WHEN TO USE IT: Wherever the signed-in student's identity is shown —
 * so far just the trailing slot of the bottom nav bar.
 *
 * DON'T: Don't assume `size`/`shape` are complete option sets — only
 * "Large" and "Circle" were ever observed.
 *
 * No real avatar image exists anywhere in this project (no photo asset,
 * and Figma's own "Image" fill couldn't be inspected or exported while
 * disconnected). Renders the initials fallback instead — a real, common
 * avatar pattern, not an invented one — using the "H" Figma's own
 * instance already carries as its Initials property. Swap in a real
 * `src` once an actual avatar-image system exists; not attempted here
 * since there's nothing real to point it at yet.
 */

export type AvatarSize = "Large";
export type AvatarShape = "Circle";

export interface AvatarProps {
  size?: AvatarSize;
  shape?: AvatarShape;
  /** Figma property name: Initials. Used as the fallback — see the
   * component doc above for why there's no image mode yet. */
  initials: string;
}

export function Avatar({ size = "Large", shape = "Circle", initials }: AvatarProps) {
  const className = [styles.avatar, styles[`size${size}`], styles[`shape${shape}`]].join(" ");

  return <span className={className}>{initials}</span>;
}
