import type { ReactNode } from "react";
import { IconBadge, type IconBadgeColor } from "../IconBadge/IconBadge";
import { IconSlot } from "../IconSlot/IconSlot";
import { ChevronRight, GraduationHat01 } from "../Icons/Icons";
import styles from "./SuperlistItem.module.css";

/**
 * A leading-icon list row. Figma: "Superlist item" component (a single
 * static component, not a component set — no variant axis, just two
 * properties).
 *
 * WHAT IT IS: A leading-icon list row — an Icon badge, a title, a
 * descriptor line below it (reusing .List Bottom Section), and an
 * optional trailing chevron. Two properties: Icon (instance-swap, swaps a
 * whole Icon badge instance) and Show trailing chevron (boolean, default
 * true).
 *
 * WHEN TO USE IT: Any row that pairs a category/topic icon with a title
 * and a short supporting line — a tappable navigation row (chevron on),
 * or a static, non-tappable info row (chevron off).
 *
 * DON'T: Don't confuse this with the existing "listItem" component
 * elsewhere in this section — that's a different, generic
 * selectable-row builder. Don't leave "Show trailing chevron" on for a
 * row that isn't actually tappable. To recolor the icon, swap the Icon
 * property to a different Icon badge color; to change just the glyph,
 * drill into that instance once and use its own Icon property.
 *
 * Composed from the already-built IconBadge (the leading icon — Figma's
 * "Icon" property swaps the whole badge, icon and color together, so
 * both are exposed here separately, matching IconBadge's own API) and
 * IconSlot (the trailing chevron).
 *
 * Renders as a real <button> when the chevron is on (a tappable row per
 * the description above) and a plain, non-interactive row when it's off.
 */

export interface SuperlistItemProps {
  /** The leading icon, via Figma's instance-swap "Icon" property (which
   * swaps a whole Icon badge instance — icon and color together). */
  icon?: ReactNode;
  iconColor?: IconBadgeColor;
  title?: string;
  descriptor?: string;
  /** Figma property name: Show trailing chevron. */
  showTrailingChevron?: boolean;
  onClick?: () => void;
}

export function SuperlistItem({
  icon = <GraduationHat01 />,
  iconColor = "1",
  title = "Find Study Notes",
  descriptor = "Revise",
  showTrailingChevron = true,
  onClick,
}: SuperlistItemProps) {
  const content = (
    <>
      <IconBadge icon={icon} color={iconColor} />
      <div className={styles.headline}>
        <p className={styles.title}>{title}</p>
        <p className={styles.descriptor}>{descriptor}</p>
      </div>
      {showTrailingChevron && (
        <span className={styles.chevron}>
          <IconSlot size="250" icon={<ChevronRight />} />
        </span>
      )}
    </>
  );

  if (showTrailingChevron) {
    return (
      <button type="button" className={styles.superlistItem} onClick={onClick}>
        {content}
      </button>
    );
  }

  return <div className={styles.superlistItem}>{content}</div>;
}
