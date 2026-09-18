import { ProBadge01, Flame01, Lightning01 } from "../Icons/Icons";
import styles from "./BadgeChip.module.css";

/**
 * Small icon+label pill with no background. Figma: "badgeChip" component set.
 *
 * WHAT IT IS: A small icon+label pill with no background. Each TYPE
 * variant (pro/streak/xp) hardcodes its own icon at native size —
 * pro-badge-01, flame-01, lightning-01 — since these icons are non-square
 * and would get squished by the standard iconSlot system.
 *
 * WHEN TO USE IT: Decorative metric/status badges in the appBar cluster —
 * paid-tier upsell (pro), daily-streak counter (streak), XP counter (xp).
 * Text is a shared property, override per instance.
 *
 * DON'T: Don't confuse with `chips` — chips always has a pill background,
 * this never does. Don't reuse the pro type for a generic status, it's
 * tied to the paid tier only.
 */

export type BadgeChipType = "pro" | "streak" | "xp";

export interface BadgeChipProps {
  type?: BadgeChipType;
  /** Figma property name: Label. */
  label?: string;
}

const ICON_BY_TYPE: Record<BadgeChipType, React.ComponentType> = {
  pro: ProBadge01,
  streak: Flame01,
  xp: Lightning01,
};

export function BadgeChip({ type = "pro", label = "Upgrade" }: BadgeChipProps) {
  const Icon = ICON_BY_TYPE[type];
  const typeClass = `type${type[0].toUpperCase()}${type.slice(1)}` as
    | "typePro"
    | "typeStreak"
    | "typeXp";
  const className = [styles.badge, styles[typeClass]].join(" ");

  return (
    <span className={className}>
      <span className={styles.icon}>
        <Icon />
      </span>
      <span className={styles.label}>{label}</span>
    </span>
  );
}
